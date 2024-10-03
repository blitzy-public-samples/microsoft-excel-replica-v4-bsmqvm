#include "MLIntegration.h"
#include "../Utils/DataAnalysisUtils.h"
#include <tensorflow/core/public/session.h>
#include <vector>
#include <string>
#include <map>
#include <memory>
#include <stdexcept>
#include <algorithm>

// Constructor
MLIntegration::MLIntegration() : mlModel(nullptr) {}

// Destructor
MLIntegration::~MLIntegration() {
    if (mlModel) {
        mlModel->Close();
    }
}

void MLIntegration::TrainModel(const std::vector<std::vector<double>>& features, 
                               const std::vector<double>& labels, 
                               const std::string& modelType) {
    // Step 1: Create and configure TensorFlow graph based on modelType
    tensorflow::GraphDef graph_def;
    tensorflow::Graph graph(tensorflow::OpRegistry::Global());

    if (modelType == "linear_regression") {
        CreateLinearRegressionGraph(graph, features[0].size());
    } else if (modelType == "logistic_regression") {
        CreateLogisticRegressionGraph(graph, features[0].size());
    } else {
        throw std::invalid_argument("Unsupported model type: " + modelType);
    }

    // Step 2: Preprocess input features and labels
    auto [x_tensor, y_tensor] = PreprocessData(features, labels);

    // Step 3: Initialize TensorFlow session
    tensorflow::SessionOptions options;
    std::unique_ptr<tensorflow::Session> session(tensorflow::NewSession(options));
    
    TF_CHECK_OK(session->Create(graph));

    // Step 4: Train the model using the provided data
    std::vector<std::pair<std::string, tensorflow::Tensor>> inputs = {
        {"x", x_tensor},
        {"y", y_tensor}
    };
    std::vector<tensorflow::Tensor> outputs;

    for (int epoch = 0; epoch < 1000; ++epoch) {
        TF_CHECK_OK(session->Run(inputs, {"train"}, {}, &outputs));
    }

    // Step 5: Update the mlModel property with the trained model
    mlModel = std::move(session);
}

std::vector<double> MLIntegration::PredictValues(const std::vector<std::vector<double>>& features) {
    if (!mlModel) {
        throw std::runtime_error("Model has not been trained yet.");
    }

    // Step 1: Preprocess input features
    tensorflow::Tensor x_tensor = PreprocessFeatures(features);

    // Step 2: Run the TensorFlow session with the trained model
    std::vector<std::pair<std::string, tensorflow::Tensor>> inputs = {
        {"x", x_tensor}
    };
    std::vector<tensorflow::Tensor> outputs;

    TF_CHECK_OK(mlModel->Run(inputs, {"output"}, {}, &outputs));

    // Step 3: Post-process the output
    return PostprocessOutput(outputs[0]);
}

std::map<std::string, double> MLIntegration::EvaluateModel(const std::vector<std::vector<double>>& testFeatures, 
                                                           const std::vector<double>& testLabels) {
    if (!mlModel) {
        throw std::runtime_error("Model has not been trained yet.");
    }

    // Step 1: Preprocess test features
    tensorflow::Tensor x_tensor = PreprocessFeatures(testFeatures);

    // Step 2: Run predictions on test features
    std::vector<std::pair<std::string, tensorflow::Tensor>> inputs = {
        {"x", x_tensor}
    };
    std::vector<tensorflow::Tensor> outputs;

    TF_CHECK_OK(mlModel->Run(inputs, {"output"}, {}, &outputs));

    std::vector<double> predictions = PostprocessOutput(outputs[0]);

    // Step 3: Calculate performance metrics
    return CalculateMetrics(predictions, testLabels);
}

void MLIntegration::SaveModel(const std::string& filePath) {
    if (!mlModel) {
        throw std::runtime_error("No model to save.");
    }

    // Use TensorFlow's built-in serialization mechanism
    tensorflow::GraphDef graph_def;
    TF_CHECK_OK(mlModel->Export(&graph_def));

    // Save the model to the specified file path
    TF_CHECK_OK(tensorflow::WriteTextProto(tensorflow::Env::Default(), filePath, graph_def));
}

void MLIntegration::LoadModel(const std::string& filePath) {
    // Use TensorFlow's built-in deserialization mechanism
    tensorflow::GraphDef graph_def;
    TF_CHECK_OK(tensorflow::ReadTextProto(tensorflow::Env::Default(), filePath, &graph_def));

    // Create a new session and load the model
    tensorflow::SessionOptions options;
    mlModel.reset(tensorflow::NewSession(options));
    TF_CHECK_OK(mlModel->Create(graph_def));
}

// Private helper methods

void MLIntegration::CreateLinearRegressionGraph(tensorflow::Graph& graph, int num_features) {
    using namespace tensorflow::ops;

    Scope root = Scope::NewRootScope();

    // Placeholders for input and output data
    auto x = Placeholder(root.WithOpName("x"), tensorflow::DT_FLOAT);
    auto y = Placeholder(root.WithOpName("y"), tensorflow::DT_FLOAT);

    // Variables for weights and bias
    auto w = Variable(root.WithOpName("w"), {num_features, 1}, tensorflow::DT_FLOAT);
    auto b = Variable(root.WithOpName("b"), {1}, tensorflow::DT_FLOAT);

    // Initialize variables
    auto init_w = Assign(root.WithOpName("init_w"), w, RandomNormal({num_features, 1}));
    auto init_b = Assign(root.WithOpName("init_b"), b, Const(root, {0.0f}));

    // Model
    auto pred = Add(root.WithOpName("pred"), MatMul(x, w), b);

    // Loss function
    auto loss = ReduceMean(root.WithOpName("loss"), Square(Sub(pred, y)));

    // Optimizer
    auto train_op = ApplyGradientDescent(root.WithOpName("train"), {w, b}, 0.01, {loss});

    // Output
    Identity(root.WithOpName("output"), pred);

    TF_CHECK_OK(root.ToGraphDef(&graph));
}

void MLIntegration::CreateLogisticRegressionGraph(tensorflow::Graph& graph, int num_features) {
    using namespace tensorflow::ops;

    Scope root = Scope::NewRootScope();

    // Placeholders for input and output data
    auto x = Placeholder(root.WithOpName("x"), tensorflow::DT_FLOAT);
    auto y = Placeholder(root.WithOpName("y"), tensorflow::DT_FLOAT);

    // Variables for weights and bias
    auto w = Variable(root.WithOpName("w"), {num_features, 1}, tensorflow::DT_FLOAT);
    auto b = Variable(root.WithOpName("b"), {1}, tensorflow::DT_FLOAT);

    // Initialize variables
    auto init_w = Assign(root.WithOpName("init_w"), w, RandomNormal({num_features, 1}));
    auto init_b = Assign(root.WithOpName("init_b"), b, Const(root, {0.0f}));

    // Model
    auto logits = Add(root.WithOpName("logits"), MatMul(x, w), b);
    auto pred = Sigmoid(root.WithOpName("pred"), logits);

    // Loss function
    auto loss = ReduceMean(root.WithOpName("loss"), 
                           Add(Multiply(y, Log(pred)), 
                               Multiply(Sub(Const(root, {1.0f}), y), Log(Sub(Const(root, {1.0f}), pred)))));

    // Optimizer
    auto train_op = ApplyGradientDescent(root.WithOpName("train"), {w, b}, 0.01, {loss});

    // Output
    Identity(root.WithOpName("output"), pred);

    TF_CHECK_OK(root.ToGraphDef(&graph));
}

std::pair<tensorflow::Tensor, tensorflow::Tensor> MLIntegration::PreprocessData(
    const std::vector<std::vector<double>>& features, const std::vector<double>& labels) {
    
    int num_samples = features.size();
    int num_features = features[0].size();

    tensorflow::Tensor x_tensor(tensorflow::DT_FLOAT, {num_samples, num_features});
    tensorflow::Tensor y_tensor(tensorflow::DT_FLOAT, {num_samples, 1});

    auto x_flat = x_tensor.flat<float>();
    auto y_flat = y_tensor.flat<float>();

    for (int i = 0; i < num_samples; ++i) {
        for (int j = 0; j < num_features; ++j) {
            x_flat(i * num_features + j) = static_cast<float>(features[i][j]);
        }
        y_flat(i) = static_cast<float>(labels[i]);
    }

    return {x_tensor, y_tensor};
}

tensorflow::Tensor MLIntegration::PreprocessFeatures(const std::vector<std::vector<double>>& features) {
    int num_samples = features.size();
    int num_features = features[0].size();

    tensorflow::Tensor x_tensor(tensorflow::DT_FLOAT, {num_samples, num_features});
    auto x_flat = x_tensor.flat<float>();

    for (int i = 0; i < num_samples; ++i) {
        for (int j = 0; j < num_features; ++j) {
            x_flat(i * num_features + j) = static_cast<float>(features[i][j]);
        }
    }

    return x_tensor;
}

std::vector<double> MLIntegration::PostprocessOutput(const tensorflow::Tensor& output) {
    auto flat = output.flat<float>();
    std::vector<double> result(flat.size());
    for (int i = 0; i < flat.size(); ++i) {
        result[i] = static_cast<double>(flat(i));
    }
    return result;
}

std::map<std::string, double> MLIntegration::CalculateMetrics(const std::vector<double>& predictions, 
                                                              const std::vector<double>& actual) {
    std::map<std::string, double> metrics;

    // Mean Squared Error
    double mse = 0.0;
    for (size_t i = 0; i < predictions.size(); ++i) {
        double error = predictions[i] - actual[i];
        mse += error * error;
    }
    mse /= predictions.size();
    metrics["mse"] = mse;

    // Root Mean Squared Error
    metrics["rmse"] = std::sqrt(mse);

    // Mean Absolute Error
    double mae = 0.0;
    for (size_t i = 0; i < predictions.size(); ++i) {
        mae += std::abs(predictions[i] - actual[i]);
    }
    mae /= predictions.size();
    metrics["mae"] = mae;

    // R-squared (coefficient of determination)
    double ss_tot = 0.0;
    double mean_actual = std::accumulate(actual.begin(), actual.end(), 0.0) / actual.size();
    for (const auto& y : actual) {
        ss_tot += (y - mean_actual) * (y - mean_actual);
    }
    double ss_res = 0.0;
    for (size_t i = 0; i < predictions.size(); ++i) {
        ss_res += (actual[i] - predictions[i]) * (actual[i] - predictions[i]);
    }
    metrics["r_squared"] = 1 - (ss_res / ss_tot);

    return metrics;
}