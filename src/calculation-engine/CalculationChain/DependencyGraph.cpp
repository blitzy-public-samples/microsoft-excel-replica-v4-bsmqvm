#include "DependencyGraph.h"
#include "src/core-engine/DataStructures/Cell.h"
#include "src/core-engine/DataStructures/Range.h"
#include "src/calculation-engine/ErrorHandling/CalculationErrors.h"
#include <algorithm>
#include <queue>

DependencyGraph::DependencyGraph() : dependencies_(), reverseDependencies_() {}

void DependencyGraph::AddDependency(const CellID& dependent, const CellID& dependsOn) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    dependencies_[dependent].insert(dependsOn);
    reverseDependencies_[dependsOn].insert(dependent);

    if (HasCircularDependency(dependent)) {
        // Remove the dependency we just added
        dependencies_[dependent].erase(dependsOn);
        reverseDependencies_[dependsOn].erase(dependent);
        throw CalculationError(ErrorType::CircularReference, "Circular dependency detected");
    }
}

void DependencyGraph::RemoveDependency(const CellID& dependent, const CellID& dependsOn) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    auto depIt = dependencies_.find(dependent);
    if (depIt != dependencies_.end()) {
        depIt->second.erase(dependsOn);
        if (depIt->second.empty()) {
            dependencies_.erase(depIt);
        }
    }

    auto revDepIt = reverseDependencies_.find(dependsOn);
    if (revDepIt != reverseDependencies_.end()) {
        revDepIt->second.erase(dependent);
        if (revDepIt->second.empty()) {
            reverseDependencies_.erase(revDepIt);
        }
    }
}

std::vector<CellID> DependencyGraph::GetDependents(const CellID& cell) const {
    std::lock_guard<std::mutex> lock(mutex_);
    
    auto it = reverseDependencies_.find(cell);
    if (it != reverseDependencies_.end()) {
        return std::vector<CellID>(it->second.begin(), it->second.end());
    }
    return std::vector<CellID>();
}

std::vector<CellID> DependencyGraph::GetDependencies(const CellID& cell) const {
    std::lock_guard<std::mutex> lock(mutex_);
    
    auto it = dependencies_.find(cell);
    if (it != dependencies_.end()) {
        return std::vector<CellID>(it->second.begin(), it->second.end());
    }
    return std::vector<CellID>();
}

void DependencyGraph::UpdateDependencies(const CellID& cell, const std::vector<CellID>& newDependencies) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    // Remove old dependencies
    auto oldDeps = GetDependencies(cell);
    for (const auto& oldDep : oldDeps) {
        RemoveDependency(cell, oldDep);
    }

    // Add new dependencies
    for (const auto& newDep : newDependencies) {
        try {
            AddDependency(cell, newDep);
        } catch (const CalculationError& e) {
            // Rollback changes if a circular dependency is detected
            for (const auto& addedDep : newDependencies) {
                if (addedDep == newDep) break;
                RemoveDependency(cell, addedDep);
            }
            throw; // Re-throw the exception
        }
    }
}

bool DependencyGraph::HasCircularDependency(const CellID& startCell) const {
    std::unordered_set<CellID> visited;
    std::queue<CellID> toVisit;
    toVisit.push(startCell);

    while (!toVisit.empty()) {
        CellID current = toVisit.front();
        toVisit.pop();

        if (current == startCell && !toVisit.empty()) {
            return true; // We've come back to the start cell
        }

        if (visited.find(current) != visited.end()) {
            continue; // Skip already visited cells
        }

        visited.insert(current);

        auto depIt = dependencies_.find(current);
        if (depIt != dependencies_.end()) {
            for (const auto& dep : depIt->second) {
                toVisit.push(dep);
            }
        }
    }

    return false;
}

void DependencyGraph::Clear() {
    std::lock_guard<std::mutex> lock(mutex_);
    dependencies_.clear();
    reverseDependencies_.clear();
}

size_t DependencyGraph::Size() const {
    std::lock_guard<std::mutex> lock(mutex_);
    return dependencies_.size();
}

bool DependencyGraph::IsEmpty() const {
    std::lock_guard<std::mutex> lock(mutex_);
    return dependencies_.empty();
}