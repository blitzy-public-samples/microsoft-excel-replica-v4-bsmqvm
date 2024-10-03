#include "FileWriter.h"
#include "../DataStructures/Workbook.h"
#include "../Utils/ErrorHandling.h"
#include <fstream>
#include <iostream>
#include <algorithm>

FileWriter::FileWriter() {
    // Initialize supportedFormats vector with supported file formats
    supportedFormats = {"xlsx", "csv", "txt"};
    // Set up any necessary resources for file writing
    // (No additional setup required for now)
}

bool FileWriter::WriteWorkbook(const Workbook& workbook, const std::string& filePath, const std::string& format) {
    if (!IsSupportedFormat(format)) {
        ErrorHandling::ReportError("Unsupported file format: " + format);
        return false;
    }

    std::ofstream file(filePath, std::ios::binary);
    if (!file.is_open()) {
        ErrorHandling::ReportError("Failed to open file: " + filePath);
        return false;
    }

    bool result = false;
    try {
        if (format == "xlsx") {
            result = WriteXLSX(workbook, file);
        } else if (format == "csv") {
            result = WriteCSV(workbook, file);
        } else if (format == "txt") {
            result = WriteTXT(workbook, file);
        }
    } catch (const std::exception& e) {
        ErrorHandling::ReportError("Error writing workbook: " + std::string(e.what()));
        result = false;
    }

    file.close();
    return result;
}

bool FileWriter::WriteWorkbookToStream(const Workbook& workbook, std::ostream& stream, const std::string& format) {
    if (!IsSupportedFormat(format)) {
        ErrorHandling::ReportError("Unsupported file format: " + format);
        return false;
    }

    bool result = false;
    try {
        if (format == "xlsx") {
            result = WriteXLSX(workbook, stream);
        } else if (format == "csv") {
            result = WriteCSV(workbook, stream);
        } else if (format == "txt") {
            result = WriteTXT(workbook, stream);
        }
    } catch (const std::exception& e) {
        ErrorHandling::ReportError("Error writing workbook to stream: " + std::string(e.what()));
        result = false;
    }

    return result;
}

bool FileWriter::IsSupportedFormat(const std::string& format) const {
    return std::find(supportedFormats.begin(), supportedFormats.end(), format) != supportedFormats.end();
}

bool FileWriter::WriteXLSX(const Workbook& workbook, std::ostream& stream) {
    // Implement XLSX writing logic here
    // This is a placeholder implementation
    stream << "XLSX format writing not implemented yet";
    return true;
}

bool FileWriter::WriteCSV(const Workbook& workbook, std::ostream& stream) {
    // Implement CSV writing logic here
    for (const auto& worksheet : workbook.GetWorksheets()) {
        for (const auto& row : worksheet.GetRows()) {
            for (size_t i = 0; i < row.size(); ++i) {
                if (i > 0) stream << ",";
                stream << EscapeCSV(row[i].GetValue());
            }
            stream << "\n";
        }
        stream << "\n"; // Add an extra newline between worksheets
    }
    return true;
}

bool FileWriter::WriteTXT(const Workbook& workbook, std::ostream& stream) {
    // Implement TXT writing logic here
    for (const auto& worksheet : workbook.GetWorksheets()) {
        stream << "Worksheet: " << worksheet.GetName() << "\n\n";
        for (const auto& row : worksheet.GetRows()) {
            for (const auto& cell : row) {
                stream << cell.GetValue() << "\t";
            }
            stream << "\n";
        }
        stream << "\n"; // Add an extra newline between worksheets
    }
    return true;
}

std::string FileWriter::EscapeCSV(const std::string& value) {
    if (value.find(',') != std::string::npos || value.find('"') != std::string::npos || value.find('\n') != std::string::npos) {
        std::string escaped = value;
        // Replace all double quotes with two double quotes
        size_t pos = 0;
        while ((pos = escaped.find('"', pos)) != std::string::npos) {
            escaped.replace(pos, 1, "\"\"");
            pos += 2;
        }
        // Enclose the value in double quotes
        return "\"" + escaped + "\"";
    }
    return value;
}