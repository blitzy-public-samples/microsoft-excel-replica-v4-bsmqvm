#ifndef ML_INTEGRATION_H
#define ML_INTEGRATION_H

#include "../Interfaces/IDataAnalysisEngine.h"
#include "../Utils/DataAnalysisUtils.h"
#include <vector>
#include <string>
#include <map>
#include <memory>
#include <tensorflow/core/public/session.h>

namespace ExcelDataAnalysis {

/**
 * @class MLIntegration
 * @brief This class provides the interface for machine learning integration within the Data Analysis Engine.
 * 
 * The MLIntegration class offers functionality to train machine learning models, make predictions,
 * evaluate model performance, and save/load models. It integrates with TensorFlow for advanced
 * machine learning capabilities.
 */
class MLIntegration {
public:
    /**
     * @brief Virtual destructor to ensure proper cleanup of derived classes.
     */
    virtual ~MLIntegration() = default;

    /**
     * @brief Trains a machine learning model using the provided features and labels.
     * 
     * @param features A 2D vector of input features for training.
     * @param labels A vector of corresponding labels for the input features.
     * @param modelType A string specifying the type of model to train.
     */
    virtual void TrainModel(const std::vector<std::vector<double>>& features,
                            const std::vector<double>& labels,
                            const std::string& modelType) = 0;

    /**
     * @brief Makes predictions using the trained model on the provided features.
     * 
     * @param features A 2D vector of input features for prediction.
     * @return A vector of predicted values.
     */
    virtual std::vector<double> PredictValues(const std::vector<std::vector<double>>& features) = 0;

    /**
     * @brief Evaluates the performance of the trained model on test data.
     * 
     * @param testFeatures A 2D vector of input features for testing.
     * @param testLabels A vector of true labels for the test features.
     * @return A map of evaluation metrics (e.g., accuracy, precision, recall).
     */
    virtual std::map<std::string, double> EvaluateModel(const std::vector<std::vector<double>>& testFeatures,
                                                        const std::vector<double>& testLabels) = 0;

    /**
     * @brief Saves the trained model to a file.
     * 
     * @param filePath The path where the model should be saved.
     */
    virtual void SaveModel(const std::string& filePath) = 0;

    /**
     * @brief Loads a pre-trained model from a file.
     * 
     * @param filePath The path from which to load the model.
     */
    virtual void LoadModel(const std::string& filePath) = 0;

protected:
    std::unique_ptr<tensorflow::Session> mlModel; ///< The TensorFlow session for the ML model.
};

} // namespace ExcelDataAnalysis

#endif // ML_INTEGRATION_H