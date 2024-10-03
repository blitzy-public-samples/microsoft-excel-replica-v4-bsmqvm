#ifndef CORE_ENGINE_FILEIO_FILEREADER_H
#define CORE_ENGINE_FILEIO_FILEREADER_H

#include <string>
#include <vector>
#include <iostream>
#include "../DataStructures/Workbook.h"
#include "../Utils/ErrorHandling.h"

namespace CoreEngine {
namespace FileIO {

/**
 * @class FileReader
 * @brief This class is responsible for reading Excel workbook files from various sources and formats,
 *        converting them into Workbook objects for use in the core engine.
 */
class FileReader {
public:
    /**
     * @brief Constructs a FileReader object, initializing supported formats.
     */
    FileReader();

    /**
     * @brief Reads an Excel workbook from the specified file path and returns a Workbook object.
     * @param filePath The path of the file to be read.
     * @return Pointer to the read Workbook object.
     * @throws ErrorHandling::FileReadError if there's an issue reading the file.
     */
    DataStructures::Workbook* ReadWorkbook(const std::string& filePath);

    /**
     * @brief Reads an Excel workbook from an input stream and returns a Workbook object.
     * @param stream The input stream containing the workbook data.
     * @param format The format of the workbook in the stream.
     * @return Pointer to the read Workbook object.
     * @throws ErrorHandling::FileReadError if there's an issue reading from the stream.
     */
    DataStructures::Workbook* ReadWorkbookFromStream(std::istream& stream, const std::string& format);

    /**
     * @brief Checks if the given file format is supported by the FileReader.
     * @param format The format to check.
     * @return True if the format is supported, false otherwise.
     */
    bool IsSupportedFormat(const std::string& format) const;

private:
    std::vector<std::string> supportedFormats;

    /**
     * @brief Determines the file format based on the file extension.
     * @param filePath The path of the file.
     * @return The determined file format.
     */
    std::string DetermineFileFormat(const std::string& filePath) const;

    /**
     * @brief Reads the content of a file.
     * @param filePath The path of the file to read.
     * @return The content of the file as a string.
     * @throws ErrorHandling::FileReadError if there's an issue reading the file.
     */
    std::string ReadFileContent(const std::string& filePath) const;

    /**
     * @brief Parses the content and creates a Workbook object.
     * @param content The content to parse.
     * @param format The format of the content.
     * @return Pointer to the created Workbook object.
     * @throws ErrorHandling::ParseError if there's an issue parsing the content.
     */
    DataStructures::Workbook* ParseContent(const std::string& content, const std::string& format) const;
};

} // namespace FileIO
} // namespace CoreEngine

#endif // CORE_ENGINE_FILEIO_FILEREADER_H