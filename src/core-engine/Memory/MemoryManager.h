#ifndef MEMORY_MANAGER_H
#define MEMORY_MANAGER_H

#include <cstddef>
#include <vector>

// Forward declaration for error handling
namespace ErrorHandling {
    void ReportError(const char* message);
}

class MemoryManager {
public:
    MemoryManager();
    ~MemoryManager();

    // Allocates a block of memory of the specified size
    void* AllocateMemory(std::size_t size);

    // Deallocates a previously allocated block of memory
    void DeallocateMemory(void* ptr);

    // Returns the total amount of allocated memory
    std::size_t GetTotalAllocated() const;

    // Sets the maximum allowed memory allocation
    void SetMaxAllocation(std::size_t max);

    // Performs memory optimization, such as defragmentation or compaction
    void OptimizeMemory();

private:
    struct MemoryBlock {
        void* ptr;
        std::size_t size;
        bool isFree;
    };

    std::vector<MemoryBlock> memoryPool;
    std::size_t totalAllocated;
    std::size_t maxAllocation;

    // Helper functions
    MemoryBlock* FindSuitableBlock(std::size_t size);
    void SplitBlock(MemoryBlock* block, std::size_t size);
    void MergeAdjacentFreeBlocks();
};

#endif // MEMORY_MANAGER_H