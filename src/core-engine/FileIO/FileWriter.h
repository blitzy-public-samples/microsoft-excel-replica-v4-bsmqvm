#ifndef CORE_ENGINE_FILEIO_FILEWRITER_H
#define CORE_ENGINE_FILEIO_FILEWRITER_H

#include <string>
#include <vector>
#include <iostream>
#include "../DataStructures/Workbook.h"
#include "../Utils/ErrorHandling.h"

namespace CoreEngine {
namespace FileIO {

/**
 * @class FileWriter
 * @brief Responsible for writing Excel workbook data to various file formats and destinations.
 * 
 * This class handles the writing of Workbook objects to files or streams in different formats,
 * ensuring data persistence and export functionality in the core engine of Microsoft Excel.
 */
class FileWriter {
public:
    /**
     * @brief Constructs a FileWriter object, initializing supported formats for writing.
     */
    FileWriter();

    /**
     * @brief Writes the given Workbook object to a file at the specified path in the specified format.
     * 
     * @param workbook The Workbook object to be written.
     * @param filePath The path where the file should be written.
     * @param format The format in which the workbook should be written.
     * @return true if the write operation was successful, false otherwise.
     */
    bool WriteWorkbook(const DataStructures::Workbook& workbook, const std::string& filePath, const std::string& format);

    /**
     * @brief Writes the given Workbook object to an output stream in the specified format.
     * 
     * @param workbook The Workbook object to be written.
     * @param stream The output stream to which the workbook should be written.
     * @param format The format in which the workbook should be written.
     * @return true if the write operation was successful, false otherwise.
     */
    bool WriteWorkbookToStream(const DataStructures::Workbook& workbook, std::ostream& stream, const std::string& format);

    /**
     * @brief Checks if the given file format is supported for writing by the FileWriter.
     * 
     * @param format The format to check for support.
     * @return true if the format is supported, false otherwise.
     */
    bool IsSupportedFormat(const std::string& format) const;

private:
    std::vector<std::string> supportedFormats;

    /**
     * @brief Initializes the supported formats for writing.
     */
    void InitializeSupportedFormats();

    /**
     * @brief Writes the workbook data in the specified format.
     * 
     * @param workbook The Workbook object to be written.
     * @param stream The output stream to which the workbook should be written.
     * @param format The format in which the workbook should be written.
     * @return true if the write operation was successful, false otherwise.
     */
    bool WriteWorkbookData(const DataStructures::Workbook& workbook, std::ostream& stream, const std::string& format);

    /**
     * @brief Handles any errors that occur during writing.
     * 
     * @param errorMessage The error message to be handled.
     */
    void HandleWriteError(const std::string& errorMessage);
};

} // namespace FileIO
} // namespace CoreEngine

#endif // CORE_ENGINE_FILEIO_FILEWRITER_H