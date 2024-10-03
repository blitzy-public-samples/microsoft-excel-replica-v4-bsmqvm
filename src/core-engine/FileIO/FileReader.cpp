#include "FileReader.h"
#include "../DataStructures/Workbook.h"
#include "../Utils/ErrorHandling.h"
#include "../Utils/Logging.h"
#include <fstream>
#include <algorithm>
#include <cctype>
#include <stdexcept>

namespace ExcelCore {
namespace FileIO {

FileReader::FileReader() {
    // Initialize the supportedFormats vector with the list of supported file formats
    supportedFormats = {".xlsx", ".xls", ".csv", ".ods"};
    Logger::log(LogLevel::INFO, "FileReader initialized with supported formats: " + getSupportedFormatsString());
}

Workbook* FileReader::ReadWorkbook(const std::string& filePath) {
    Logger::log(LogLevel::INFO, "Starting to read workbook from file: " + filePath);

    // Check if the file exists
    std::ifstream file(filePath);
    if (!file.good()) {
        throw ErrorHandling::FileIOException("File does not exist or cannot be opened: " + filePath);
    }

    // Determine the file format based on the file extension
    std::string fileExtension = getFileExtension(filePath);
    if (!IsSupportedFormat(fileExtension)) {
        throw ErrorHandling::UnsupportedFormatException("Unsupported file format: " + fileExtension);
    }

    // Create a new Workbook object
    Workbook* workbook = new Workbook();

    try {
        // Based on the file format, call the appropriate parsing function
        if (fileExtension == ".xlsx" || fileExtension == ".xls") {
            parseExcelFile(file, workbook, fileExtension);
        } else if (fileExtension == ".csv") {
            parseCsvFile(file, workbook);
        } else if (fileExtension == ".ods") {
            parseOdsFile(file, workbook);
        }

        Logger::log(LogLevel::INFO, "Successfully read workbook from file: " + filePath);
        return workbook;
    } catch (const std::exception& e) {
        delete workbook;
        Logger::log(LogLevel::ERROR, "Error reading workbook: " + std::string(e.what()));
        throw ErrorHandling::FileIOException("Error reading workbook: " + std::string(e.what()));
    }
}

Workbook* FileReader::ReadWorkbookFromStream(std::istream& stream, const std::string& format) {
    Logger::log(LogLevel::INFO, "Starting to read workbook from stream with format: " + format);

    if (!IsSupportedFormat(format)) {
        throw ErrorHandling::UnsupportedFormatException("Unsupported file format: " + format);
    }

    Workbook* workbook = new Workbook();

    try {
        // Based on the specified format, call the appropriate parsing function
        if (format == ".xlsx" || format == ".xls") {
            parseExcelFile(stream, workbook, format);
        } else if (format == ".csv") {
            parseCsvFile(stream, workbook);
        } else if (format == ".ods") {
            parseOdsFile(stream, workbook);
        }

        Logger::log(LogLevel::INFO, "Successfully read workbook from stream");
        return workbook;
    } catch (const std::exception& e) {
        delete workbook;
        Logger::log(LogLevel::ERROR, "Error reading workbook from stream: " + std::string(e.what()));
        throw ErrorHandling::FileIOException("Error reading workbook from stream: " + std::string(e.what()));
    }
}

bool FileReader::IsSupportedFormat(const std::string& format) {
    // Convert the input format to lowercase for case-insensitive comparison
    std::string lowerFormat = format;
    std::transform(lowerFormat.begin(), lowerFormat.end(), lowerFormat.begin(),
                   [](unsigned char c){ return std::tolower(c); });

    // Use std::find to search for the format in the supportedFormats vector
    return std::find(supportedFormats.begin(), supportedFormats.end(), lowerFormat) != supportedFormats.end();
}

std::string FileReader::getFileExtension(const std::string& filePath) {
    size_t dotPos = filePath.find_last_of('.');
    if (dotPos != std::string::npos) {
        return filePath.substr(dotPos);
    }
    return "";
}

std::string FileReader::getSupportedFormatsString() const {
    std::string formats;
    for (const auto& format : supportedFormats) {
        if (!formats.empty()) {
            formats += ", ";
        }
        formats += format;
    }
    return formats;
}

void FileReader::parseExcelFile(std::istream& stream, Workbook* workbook, const std::string& format) {
    // TODO: Implement Excel file parsing logic
    // This would typically involve using a library like OpenXLSX or libxls
    // For now, we'll just add a placeholder sheet
    workbook->addSheet("Sheet1");
    Logger::log(LogLevel::INFO, "Parsed Excel file with format: " + format);
}

void FileReader::parseCsvFile(std::istream& stream, Workbook* workbook) {
    // TODO: Implement CSV file parsing logic
    // This would involve reading the CSV data and populating the workbook
    // For now, we'll just add a placeholder sheet
    workbook->addSheet("Sheet1");
    Logger::log(LogLevel::INFO, "Parsed CSV file");
}

void FileReader::parseOdsFile(std::istream& stream, Workbook* workbook) {
    // TODO: Implement ODS file parsing logic
    // This would typically involve using a library that can handle ODS format
    // For now, we'll just add a placeholder sheet
    workbook->addSheet("Sheet1");
    Logger::log(LogLevel::INFO, "Parsed ODS file");
}

} // namespace FileIO
} // namespace ExcelCore