#ifndef IFUNCTION_LIBRARY_H
#define IFUNCTION_LIBRARY_H

#include <string>
#include <vector>
#include <variant>

/**
 * @interface IFunctionLibrary
 * @brief This abstract class defines the interface for the Function Library component.
 * 
 * The Function Library component is responsible for providing access to and executing
 * various Excel functions. It is a key part of the Excel Calculation Engine.
 */
class IFunctionLibrary {
public:
    /**
     * @brief Virtual destructor to ensure proper cleanup of derived classes.
     */
    virtual ~IFunctionLibrary() = default;

    /**
     * @brief Execute an Excel function with the given name and arguments.
     * 
     * @param functionName The name of the function to execute.
     * @param arguments A vector of arguments for the function. Arguments can be of type double, string, or bool.
     * @return std::variant<double, std::string, bool> The result of the function execution.
     */
    virtual std::variant<double, std::string, bool> ExecuteFunction(
        const std::string& functionName,
        const std::vector<std::variant<double, std::string, bool>>& arguments) = 0;

    /**
     * @brief Check if a function is supported by the library.
     * 
     * @param functionName The name of the function to check.
     * @return bool True if the function is supported, false otherwise.
     */
    virtual bool IsFunctionSupported(const std::string& functionName) const = 0;
};

#endif // IFUNCTION_LIBRARY_H