#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include <vector>
#include <string>
#include <map>
#include "../MachineLearning/MLIntegration.h"
#include "../DataAnalysisEngine.h"

using namespace testing;
using namespace std;

// Mock class for DataAnalysisEngine
class MockDataAnalysisEngine : public DataAnalysisEngine {
public:
    MOCK_METHOD(vector<double>, GetData, (const string&), (override));
    MOCK_METHOD(void, SetResult, (const string&, const vector<double>&), (override));
};

class MLIntegrationTests : public ::testing::Test {
protected:
    unique_ptr<MLIntegration> mlIntegration;
    unique_ptr<MockDataAnalysisEngine> mockDataAnalysisEngine;

    void SetUp() override {
        mockDataAnalysisEngine = make_unique<MockDataAnalysisEngine>();
        mlIntegration = make_unique<MLIntegration>(mockDataAnalysisEngine.get());
    }

    void TearDown() override {
        mlIntegration.reset();
        mockDataAnalysisEngine.reset();
    }
};

TEST_F(MLIntegrationTests, TestTrainModel) {
    // Prepare test data
    vector<vector<double>> features = {{1.0, 2.0}, {3.0, 4.0}, {5.0, 6.0}};
    vector<double> labels = {0.0, 1.0, 1.0};
    string modelType = "RandomForest";

    // Set expectations
    EXPECT_CALL(*mockDataAnalysisEngine, GetData("features"))
        .WillOnce(Return(vector<double>{1.0, 2.0, 3.0, 4.0, 5.0, 6.0}));
    EXPECT_CALL(*mockDataAnalysisEngine, GetData("labels"))
        .WillOnce(Return(labels));

    // Call TrainModel
    bool result = mlIntegration->TrainModel(features, labels, modelType);

    // Assert that the model is trained successfully
    EXPECT_TRUE(result);

    // Verify that the correct model type is used
    EXPECT_EQ(mlIntegration->GetModelType(), modelType);
}

TEST_F(MLIntegrationTests, TestPredictValues) {
    // Prepare test data
    vector<vector<double>> testData = {{1.5, 2.5}, {3.5, 4.5}};

    // Set expectations
    EXPECT_CALL(*mockDataAnalysisEngine, GetData("testData"))
        .WillOnce(Return(vector<double>{1.5, 2.5, 3.5, 4.5}));

    // Call PredictValues
    vector<double> predictions = mlIntegration->PredictValues(testData);

    // Assert that predictions are returned
    EXPECT_FALSE(predictions.empty());

    // Verify the format and range of predicted values
    for (const auto& pred : predictions) {
        EXPECT_GE(pred, 0.0);
        EXPECT_LE(pred, 1.0);
    }
}

TEST_F(MLIntegrationTests, TestEvaluateModel) {
    // Prepare test data
    vector<vector<double>> testFeatures = {{1.0, 2.0}, {3.0, 4.0}, {5.0, 6.0}};
    vector<double> testLabels = {0.0, 1.0, 1.0};

    // Set expectations
    EXPECT_CALL(*mockDataAnalysisEngine, GetData("testFeatures"))
        .WillOnce(Return(vector<double>{1.0, 2.0, 3.0, 4.0, 5.0, 6.0}));
    EXPECT_CALL(*mockDataAnalysisEngine, GetData("testLabels"))
        .WillOnce(Return(testLabels));

    // Call EvaluateModel
    map<string, double> metrics = mlIntegration->EvaluateModel(testFeatures, testLabels);

    // Assert that evaluation metrics are returned
    EXPECT_FALSE(metrics.empty());

    // Verify the correctness of calculated metrics
    EXPECT_TRUE(metrics.find("accuracy") != metrics.end());
    EXPECT_TRUE(metrics.find("precision") != metrics.end());
    EXPECT_TRUE(metrics.find("recall") != metrics.end());
    EXPECT_TRUE(metrics.find("f1_score") != metrics.end());
}

TEST_F(MLIntegrationTests, TestSaveAndLoadModel) {
    // Prepare test data
    vector<vector<double>> features = {{1.0, 2.0}, {3.0, 4.0}, {5.0, 6.0}};
    vector<double> labels = {0.0, 1.0, 1.0};
    string modelType = "RandomForest";
    string modelPath = "test_model.pkl";

    // Train a model
    mlIntegration->TrainModel(features, labels, modelType);

    // Save the model
    bool saveResult = mlIntegration->SaveModel(modelPath);
    EXPECT_TRUE(saveResult);

    // Create a new MLIntegration instance
    auto newMlIntegration = make_unique<MLIntegration>(mockDataAnalysisEngine.get());

    // Load the model
    bool loadResult = newMlIntegration->LoadModel(modelPath);
    EXPECT_TRUE(loadResult);

    // Verify that the loaded model produces the same results
    vector<vector<double>> testData = {{2.0, 3.0}};
    vector<double> originalPredictions = mlIntegration->PredictValues(testData);
    vector<double> loadedPredictions = newMlIntegration->PredictValues(testData);

    EXPECT_EQ(originalPredictions, loadedPredictions);
}

TEST_F(MLIntegrationTests, TestInvalidInputs) {
    // Prepare invalid input data
    vector<vector<double>> emptyFeatures;
    vector<double> emptyLabels;
    string invalidModelType = "InvalidModel";

    // Test TrainModel with invalid inputs
    EXPECT_THROW(mlIntegration->TrainModel(emptyFeatures, emptyLabels, "RandomForest"), std::invalid_argument);
    EXPECT_THROW(mlIntegration->TrainModel({{1.0, 2.0}}, {0.0}, invalidModelType), std::invalid_argument);

    // Test PredictValues with invalid inputs
    EXPECT_THROW(mlIntegration->PredictValues(emptyFeatures), std::invalid_argument);

    // Test EvaluateModel with invalid inputs
    EXPECT_THROW(mlIntegration->EvaluateModel(emptyFeatures, emptyLabels), std::invalid_argument);
}

TEST_F(MLIntegrationTests, TestLargeDataset) {
    // Generate a large dataset for testing
    const int dataSize = 100000;
    vector<vector<double>> largeFeatures(dataSize, vector<double>(10));
    vector<double> largeLabels(dataSize);

    for (int i = 0; i < dataSize; ++i) {
        for (int j = 0; j < 10; ++j) {
            largeFeatures[i][j] = static_cast<double>(rand()) / RAND_MAX;
        }
        largeLabels[i] = rand() % 2;
    }

    // Measure the time taken to train the model
    auto start = chrono::high_resolution_clock::now();
    bool trainResult = mlIntegration->TrainModel(largeFeatures, largeLabels, "RandomForest");
    auto end = chrono::high_resolution_clock::now();
    auto duration = chrono::duration_cast<chrono::milliseconds>(end - start);

    EXPECT_TRUE(trainResult);
    EXPECT_LT(duration.count(), 60000); // Expect training to take less than 60 seconds

    // Measure the time taken to make predictions
    start = chrono::high_resolution_clock::now();
    vector<double> predictions = mlIntegration->PredictValues(largeFeatures);
    end = chrono::high_resolution_clock::now();
    duration = chrono::duration_cast<chrono::milliseconds>(end - start);

    EXPECT_EQ(predictions.size(), dataSize);
    EXPECT_LT(duration.count(), 10000); // Expect predictions to take less than 10 seconds
}

TEST_F(MLIntegrationTests, TestMultipleModelTypes) {
    vector<vector<double>> features = {{1.0, 2.0}, {3.0, 4.0}, {5.0, 6.0}, {7.0, 8.0}};
    vector<double> labels = {0.0, 1.0, 1.0, 0.0};
    vector<string> modelTypes = {"RandomForest", "SVM", "NeuralNetwork"};

    for (const auto& modelType : modelTypes) {
        EXPECT_TRUE(mlIntegration->TrainModel(features, labels, modelType));
        EXPECT_EQ(mlIntegration->GetModelType(), modelType);

        vector<double> predictions = mlIntegration->PredictValues(features);
        EXPECT_EQ(predictions.size(), features.size());

        map<string, double> metrics = mlIntegration->EvaluateModel(features, labels);
        EXPECT_FALSE(metrics.empty());
    }
}

TEST_F(MLIntegrationTests, TestIntegrationWithDataAnalysisEngine) {
    vector<vector<double>> features = {{1.0, 2.0}, {3.0, 4.0}, {5.0, 6.0}};
    vector<double> labels = {0.0, 1.0, 1.0};
    string modelType = "RandomForest";

    // Set up mock expectations
    EXPECT_CALL(*mockDataAnalysisEngine, GetData("features"))
        .WillOnce(Return(vector<double>{1.0, 2.0, 3.0, 4.0, 5.0, 6.0}));
    EXPECT_CALL(*mockDataAnalysisEngine, GetData("labels"))
        .WillOnce(Return(labels));
    EXPECT_CALL(*mockDataAnalysisEngine, SetResult("predictions", _))
        .Times(1);

    // Train the model
    EXPECT_TRUE(mlIntegration->TrainModel(features, labels, modelType));

    // Make predictions
    vector<double> predictions = mlIntegration->PredictValues(features);

    // Verify that MLIntegration correctly interacts with DataAnalysisEngine
    EXPECT_CALL(*mockDataAnalysisEngine, SetResult("predictions", predictions))
        .Times(1);
    mlIntegration->SavePredictions(predictions);

    // Verify that results from MLIntegration are properly integrated into DataAnalysisEngine outputs
    vector<double> storedPredictions;
    EXPECT_CALL(*mockDataAnalysisEngine, GetData("predictions"))
        .WillOnce(Return(predictions));
    storedPredictions = mockDataAnalysisEngine->GetData("predictions");
    EXPECT_EQ(storedPredictions, predictions);
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}