# CMake configuration for Microsoft Excel Core Engine

cmake_minimum_required(VERSION 3.12)
project(ExcelCoreEngine VERSION 1.0.0 LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Source files
set(SOURCES
    CoreEngine.cpp
    DataStructures/Workbook.cpp
    DataStructures/Worksheet.cpp
    DataStructures/Cell.cpp
    Memory/MemoryManager.cpp
    FileIO/FileReader.cpp
    FileIO/FileWriter.cpp
    Utils/ErrorHandling.cpp
    Utils/Logging.cpp
)

# Header files
set(HEADERS
    CoreEngine.h
    Interfaces/ICalculationEngine.h
    Interfaces/IDataAnalysisEngine.h
    Interfaces/IChartingEngine.h
    Interfaces/ICollaborationService.h
    Interfaces/ISecurityManager.h
    DataStructures/Workbook.h
    DataStructures/Worksheet.h
    DataStructures/Cell.h
    Memory/MemoryManager.h
    FileIO/FileReader.h
    FileIO/FileWriter.h
    Utils/ErrorHandling.h
    Utils/Logging.h
)

# Create the core engine library
add_library(ExcelCoreEngine STATIC ${SOURCES} ${HEADERS})

# Include directories
target_include_directories(ExcelCoreEngine PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/Interfaces
    ${CMAKE_CURRENT_SOURCE_DIR}/DataStructures
    ${CMAKE_CURRENT_SOURCE_DIR}/Memory
    ${CMAKE_CURRENT_SOURCE_DIR}/FileIO
    ${CMAKE_CURRENT_SOURCE_DIR}/Utils
)

# Compiler warnings
if(MSVC)
    target_compile_options(ExcelCoreEngine PRIVATE /W4 /WX)
else()
    target_compile_options(ExcelCoreEngine PRIVATE -Wall -Wextra -Wpedantic -Werror)
endif()

# Link libraries
target_link_libraries(ExcelCoreEngine PRIVATE
    # Add any external libraries here
)

# Install rules
install(TARGETS ExcelCoreEngine
    ARCHIVE DESTINATION lib
    LIBRARY DESTINATION lib
    RUNTIME DESTINATION bin
)

install(FILES ${HEADERS} DESTINATION include/ExcelCoreEngine)

# Testing
enable_testing()
add_subdirectory(Tests)

# Documentation
find_package(Doxygen)
if(DOXYGEN_FOUND)
    set(DOXYGEN_IN ${CMAKE_CURRENT_SOURCE_DIR}/Doxyfile.in)
    set(DOXYGEN_OUT ${CMAKE_CURRENT_BINARY_DIR}/Doxyfile)
    configure_file(${DOXYGEN_IN} ${DOXYGEN_OUT} @ONLY)
    add_custom_target(docs
        COMMAND ${DOXYGEN_EXECUTABLE} ${DOXYGEN_OUT}
        WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}
        COMMENT "Generating API documentation with Doxygen"
        VERBATIM
    )
endif()