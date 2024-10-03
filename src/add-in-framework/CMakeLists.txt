# Minimum CMake version required
cmake_minimum_required(VERSION 3.12)

# Project definition
project(ExcelAddInFramework)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Source files
set(SOURCES
    AddInManager.cpp
    utils/AddInLogger.cpp
    utils/ErrorHandler.cpp
    com/COMAddInWrapper.cpp
    office/OfficeAddInHost.cpp
    xll/XLLAddInWrapper.cpp
)

# Header files
set(HEADERS
    AddInManager.h
    interfaces/IAddIn.h
    interfaces/IAddInHost.h
    interfaces/IExcelInterop.h
    utils/AddInLogger.h
    utils/ErrorHandler.h
)

# Define the library
add_library(ExcelAddInFramework STATIC ${SOURCES} ${HEADERS})

# Include directories
target_include_directories(ExcelAddInFramework PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/interfaces
    ${CMAKE_CURRENT_SOURCE_DIR}/utils
)

# Compilation flags
target_compile_options(ExcelAddInFramework PRIVATE
    -Wall
    -Wextra
    -std=c++17
)

# Conditional compilation
if(WIN32)
    target_compile_definitions(ExcelAddInFramework PRIVATE WINDOWS)
elseif(APPLE)
    target_compile_definitions(ExcelAddInFramework PRIVATE MACOS)
endif()

# Installation rules
install(TARGETS ExcelAddInFramework
    ARCHIVE DESTINATION lib
    LIBRARY DESTINATION lib
    RUNTIME DESTINATION bin
)

install(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/interfaces
    DESTINATION include/excel-add-in-framework
    FILES_MATCHING PATTERN "*.h"
)

# Enable testing
enable_testing()

# Test files
set(TEST_FILES
    tests/AddInManagerTests.cpp
    tests/COMAddInWrapperTests.cpp
    tests/OfficeAddInHostTests.cpp
    tests/XLLAddInWrapperTests.cpp
)

# Add test executable
add_executable(ExcelAddInFrameworkTests ${TEST_FILES})

# Link test executable with the main library and testing framework
target_link_libraries(ExcelAddInFrameworkTests PRIVATE
    ExcelAddInFramework
    gtest_main
)

# Add tests to CTest
add_test(NAME ExcelAddInFrameworkTests COMMAND ExcelAddInFrameworkTests)