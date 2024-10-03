#ifndef DATA_ANALYSIS_ENGINE_H
#define DATA_ANALYSIS_ENGINE_H

#include "Interfaces/IDataAnalysisEngine.h"
#include "Utils/DataAnalysisUtils.h"
#include "Sorting/DataSorter.h"
#include "Filtering/DataFilter.h"
#include "PivotTables/PivotTableGenerator.h"
#include "Statistics/DescriptiveStatistics.h"
#include "Forecasting/TimeSeries.h"

#include <memory>
#include <vector>
#include <string>
#include <map>

namespace Microsoft::Excel::DataAnalysis {

class DataAnalysisEngine : public IDataAnalysisEngine {
public:
    DataAnalysisEngine();
    virtual ~DataAnalysisEngine();

    // Implement IDataAnalysisEngine interface methods
    void SortData(std::vector<double>& data, bool ascending) override;
    std::vector<double> FilterData(const std::vector<double>& data, double threshold, bool greaterThan) override;
    std::vector<std::vector<std::string>> GeneratePivotTable(const std::vector<std::vector<std::string>>& data, int rowField, int colField, int valueField) override;
    std::map<std::string, double> PerformStatisticalAnalysis(const std::vector<double>& data) override;
    std::vector<double> ForecastTimeSeries(const std::vector<double>& historicalData, int periods) override;

private:
    // Private member variables for component objects
    std::unique_ptr<DataSorter> m_dataSorter;
    std::unique_ptr<DataFilter> m_dataFilter;
    std::unique_ptr<PivotTableGenerator> m_pivotTableGenerator;
    std::unique_ptr<DescriptiveStatistics> m_descriptiveStatistics;
    std::unique_ptr<TimeSeries> m_timeSeries;

    // Private helper methods
    void InitializeComponents();
};

} // namespace Microsoft::Excel::DataAnalysis

#endif // DATA_ANALYSIS_ENGINE_H