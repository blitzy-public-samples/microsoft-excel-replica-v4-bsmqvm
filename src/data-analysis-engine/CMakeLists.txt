# Minimum CMake version
cmake_minimum_required(VERSION 3.12)

# Project name
project(DataAnalysisEngine CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Source files
set(SOURCES
    DataAnalysisEngine.cpp
    Utils/DataAnalysisUtils.cpp
    Sorting/DataSorter.cpp
    Filtering/DataFilter.cpp
    PivotTables/PivotTableGenerator.cpp
    WhatIfAnalysis/GoalSeek.cpp
    WhatIfAnalysis/Solver.cpp
    Statistics/DescriptiveStatistics.cpp
    Statistics/InferentialStatistics.cpp
    Forecasting/TimeSeries.cpp
    Forecasting/RegressionAnalysis.cpp
    MachineLearning/MLIntegration.cpp
    DataModel/DataModelManager.cpp
    PowerPivot/PowerPivotEngine.cpp
    Optimization/AnalysisOptimizer.cpp
)

# Header files
set(HEADERS
    Interfaces/IDataAnalysisEngine.h
    DataAnalysisEngine.h
    Utils/DataAnalysisUtils.h
    Sorting/DataSorter.h
    Filtering/DataFilter.h
    PivotTables/PivotTableGenerator.h
    WhatIfAnalysis/GoalSeek.h
    WhatIfAnalysis/Solver.h
    Statistics/DescriptiveStatistics.h
    Statistics/InferentialStatistics.h
    Forecasting/TimeSeries.h
    Forecasting/RegressionAnalysis.h
    MachineLearning/MLIntegration.h
    DataModel/DataModelManager.h
    PowerPivot/PowerPivotEngine.h
    Optimization/AnalysisOptimizer.h
)

# Create static library
add_library(DataAnalysisEngine STATIC ${SOURCES} ${HEADERS})

# Include directories
target_include_directories(DataAnalysisEngine PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/Interfaces
)

# Link libraries
target_link_libraries(DataAnalysisEngine PRIVATE
    # Add any external libraries here, e.g.:
    # Boost::boost
    # TensorFlow::tensorflow
)

# Compiler warnings
if(MSVC)
    target_compile_options(DataAnalysisEngine PRIVATE /W4 /WX)
else()
    target_compile_options(DataAnalysisEngine PRIVATE -Wall -Wextra -Werror)
endif()

# Install rules
install(TARGETS DataAnalysisEngine
    ARCHIVE DESTINATION lib
    LIBRARY DESTINATION lib
    RUNTIME DESTINATION bin
)

install(FILES ${HEADERS} DESTINATION include/DataAnalysisEngine)

# Testing
if(BUILD_TESTING)
    add_subdirectory(Tests)
endif()