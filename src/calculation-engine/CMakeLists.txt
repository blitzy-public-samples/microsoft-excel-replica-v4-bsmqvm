# Specify the minimum version of CMake required
cmake_minimum_required(VERSION 3.12)

# Define the project name and language
project(CalculationEngine CXX)

# Set C++ standard to C++17 and make it required
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find and include the Boost libraries
find_package(Boost REQUIRED)

# Define the CalculationEngine as a static library and list its source files
add_library(CalculationEngine STATIC
    CalculationEngine.cpp
    FormulaParser/FormulaParser.cpp
    CalculationChain/CalculationChain.cpp
    ArrayFormulas/ArrayFormulaHandler.cpp
    DynamicArrays/DynamicArrayHandler.cpp
    Optimization/CalculationOptimizer.cpp
    Caching/FormulaCache.cpp
    Multithreading/ParallelCalculation.cpp
    ErrorHandling/CalculationErrors.cpp
)

# Specify the include directories for the CalculationEngine target
target_include_directories(CalculationEngine PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${Boost_INCLUDE_DIRS}
)

# Link the Boost libraries to the CalculationEngine target
target_link_libraries(CalculationEngine PUBLIC
    ${Boost_LIBRARIES}
)

# Add the Tests subdirectory to the build
add_subdirectory(Tests)

# Enable testing
enable_testing()

# Add compiler warnings
if(MSVC)
    target_compile_options(CalculationEngine PRIVATE /W4 /WX)
else()
    target_compile_options(CalculationEngine PRIVATE -Wall -Wextra -Werror)
endif()

# Add optimization flags for Release builds
target_compile_options(CalculationEngine PRIVATE $<$<CONFIG:Release>:-O3>)

# Generate export header
include(GenerateExportHeader)
generate_export_header(CalculationEngine)

# Install rules
install(TARGETS CalculationEngine
    ARCHIVE DESTINATION lib
    LIBRARY DESTINATION lib
    RUNTIME DESTINATION bin
)

install(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/
    DESTINATION include/CalculationEngine
    FILES_MATCHING PATTERN "*.h"
)

# Package configuration
include(CMakePackageConfigHelpers)
write_basic_package_version_file(
    "${CMAKE_CURRENT_BINARY_DIR}/CalculationEngineConfigVersion.cmake"
    VERSION 1.0.0
    COMPATIBILITY SameMajorVersion
)

install(FILES
    "${CMAKE_CURRENT_BINARY_DIR}/CalculationEngineConfigVersion.cmake"
    DESTINATION lib/cmake/CalculationEngine
)

# Export the targets
install(EXPORT CalculationEngineTargets
    FILE CalculationEngineTargets.cmake
    NAMESPACE CalculationEngine::
    DESTINATION lib/cmake/CalculationEngine
)