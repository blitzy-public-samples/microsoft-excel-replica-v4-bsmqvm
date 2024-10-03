#ifndef EXCEL_CORE_ENGINE_PERFORMANCE_PROFILER_H
#define EXCEL_CORE_ENGINE_PERFORMANCE_PROFILER_H

#include <chrono>
#include <string>
#include <unordered_map>
#include <memory>

namespace excel::core_engine::performance {

struct ProfileData {
    std::chrono::high_resolution_clock::time_point startTime;
    std::chrono::duration<double> totalTime{};
    int callCount{0};
};

class Profiler {
public:
    static Profiler& GetInstance() {
        static Profiler instance;
        return instance;
    }

    void StartProfile(const std::string& operationName);
    void EndProfile(const std::string& operationName);
    std::string GetProfileReport() const;
    void EnableProfiling(bool enable);

private:
    Profiler() = default;
    ~Profiler() = default;
    Profiler(const Profiler&) = delete;
    Profiler& operator=(const Profiler&) = delete;

    std::unordered_map<std::string, ProfileData> profilingData;
    bool isEnabled{false};

    // TODO: Implement logging functionality when Logging.h is available
    // void Log(const std::string& message) const;
};

// Global function to get the Profiler instance
inline Profiler& GetProfiler() {
    return Profiler::GetInstance();
}

} // namespace excel::core_engine::performance

#endif // EXCEL_CORE_ENGINE_PERFORMANCE_PROFILER_H