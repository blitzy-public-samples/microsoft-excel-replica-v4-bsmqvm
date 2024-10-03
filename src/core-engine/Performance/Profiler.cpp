#include "Profiler.h"
#include "../Utils/Logging.h"
#include <chrono>
#include <sstream>

// Singleton instance
Profiler& GetProfiler() {
    static Profiler instance;
    return instance;
}

Profiler::Profiler() : isEnabled(false) {}

void Profiler::StartProfile(const std::string& operationName) {
    if (!isEnabled) return;

    auto startTime = std::chrono::high_resolution_clock::now();
    profilingData[operationName] = startTime;
}

void Profiler::EndProfile(const std::string& operationName) {
    if (!isEnabled) return;

    auto endTime = std::chrono::high_resolution_clock::now();
    auto startTime = profilingData[operationName];
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(endTime - startTime);

    // Update the profilingData with the elapsed time
    profilingData[operationName] = duration;

    // Log the profiling information
    std::ostringstream logMessage;
    logMessage << "Profiling: " << operationName << " took " << duration.count() << " microseconds";
    Logging::Log(LogLevel::Debug, logMessage.str());
}

std::string Profiler::GetProfileReport() {
    std::ostringstream report;
    report << "Profiling Report:\n";

    for (const auto& entry : profilingData) {
        const auto& operationName = entry.first;
        const auto& duration = std::chrono::duration_cast<std::chrono::microseconds>(entry.second).count();
        report << operationName << ": " << duration << " microseconds\n";
    }

    return report.str();
}

void Profiler::EnableProfiling(bool enable) {
    isEnabled = enable;
    std::string status = enable ? "enabled" : "disabled";
    Logging::Log(LogLevel::Info, "Profiling " + status);
}