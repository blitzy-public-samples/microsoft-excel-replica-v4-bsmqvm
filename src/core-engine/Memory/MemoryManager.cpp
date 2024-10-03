#include "MemoryManager.h"
#include "../Utils/ErrorHandling.h"
#include <algorithm>
#include <stdexcept>

MemoryManager::MemoryManager() : totalAllocated(0), maxAllocation(std::numeric_limits<std::size_t>::max()) {}

void* MemoryManager::AllocateMemory(std::size_t size) {
    std::lock_guard<std::mutex> lock(mutex);

    // Check if allocation is within maxAllocation limit
    if (totalAllocated + size > maxAllocation) {
        throw std::runtime_error("Memory allocation exceeds maximum limit");
    }

    // Find a suitable memory block in memoryPool
    auto it = std::find_if(memoryPool.begin(), memoryPool.end(),
        [size](const MemoryBlock& block) { return !block.inUse && block.size >= size; });

    void* ptr = nullptr;
    if (it != memoryPool.end()) {
        // Use existing block
        it->inUse = true;
        ptr = it->ptr;
        
        // Split block if it's significantly larger than requested size
        if (it->size > size + sizeof(MemoryBlock)) {
            MemoryBlock newBlock;
            newBlock.ptr = static_cast<char*>(it->ptr) + size;
            newBlock.size = it->size - size;
            newBlock.inUse = false;
            it->size = size;
            memoryPool.insert(std::next(it), newBlock);
        }
    } else {
        // Allocate new memory
        ptr = std::malloc(size);
        if (!ptr) {
            throw std::bad_alloc();
        }
        memoryPool.push_back({ptr, size, true});
    }

    // Update totalAllocated
    totalAllocated += size;

    return ptr;
}

void MemoryManager::DeallocateMemory(void* ptr) {
    std::lock_guard<std::mutex> lock(mutex);

    // Find the memory block in memoryPool
    auto it = std::find_if(memoryPool.begin(), memoryPool.end(),
        [ptr](const MemoryBlock& block) { return block.ptr == ptr; });

    if (it == memoryPool.end()) {
        ErrorHandling::ReportError("Attempted to deallocate unknown memory block");
        return;
    }

    // Mark the block as free
    it->inUse = false;
    totalAllocated -= it->size;

    // Merge adjacent free blocks
    auto next = std::next(it);
    while (next != memoryPool.end() && !next->inUse) {
        it->size += next->size;
        next = memoryPool.erase(next);
    }
    if (it != memoryPool.begin()) {
        auto prev = std::prev(it);
        if (!prev->inUse) {
            prev->size += it->size;
            memoryPool.erase(it);
        }
    }

    // Perform memory optimization if necessary
    OptimizeMemory();
}

std::size_t MemoryManager::GetTotalAllocated() const {
    std::lock_guard<std::mutex> lock(mutex);
    return totalAllocated;
}

void MemoryManager::SetMaxAllocation(std::size_t max) {
    std::lock_guard<std::mutex> lock(mutex);
    maxAllocation = max;
    
    // Perform necessary adjustments if current allocation exceeds new max
    if (totalAllocated > maxAllocation) {
        OptimizeMemory();
        if (totalAllocated > maxAllocation) {
            ErrorHandling::ReportError("Unable to reduce memory usage below new maximum allocation");
        }
    }
}

void MemoryManager::OptimizeMemory() {
    // Analyze memory fragmentation
    std::size_t fragmentedMemory = 0;
    for (const auto& block : memoryPool) {
        if (!block.inUse) {
            fragmentedMemory += block.size;
        }
    }

    // If fragmentation is above a certain threshold, compact memory blocks
    if (fragmentedMemory > totalAllocated * 0.2) { // 20% fragmentation threshold
        std::vector<MemoryBlock> newPool;
        for (auto& block : memoryPool) {
            if (block.inUse) {
                void* newPtr = std::malloc(block.size);
                if (newPtr) {
                    std::memcpy(newPtr, block.ptr, block.size);
                    std::free(block.ptr);
                    newPool.push_back({newPtr, block.size, true});
                } else {
                    ErrorHandling::ReportError("Failed to allocate memory during optimization");
                    return;
                }
            }
        }
        memoryPool = std::move(newPool);
    }

    // Release unused memory back to the system
    memoryPool.erase(
        std::remove_if(memoryPool.begin(), memoryPool.end(),
            [](const MemoryBlock& block) { return !block.inUse; }),
        memoryPool.end()
    );
}

MemoryManager::~MemoryManager() {
    for (const auto& block : memoryPool) {
        if (block.inUse) {
            ErrorHandling::ReportError("Memory leak detected: not all allocated memory was freed");
        }
        std::free(block.ptr);
    }
}