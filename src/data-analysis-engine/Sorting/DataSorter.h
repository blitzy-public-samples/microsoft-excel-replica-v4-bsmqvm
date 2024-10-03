#ifndef DATA_SORTER_H
#define DATA_SORTER_H

#include <vector>
#include <string>
#include <algorithm>

namespace Microsoft::Excel::DataAnalysis {

/**
 * @class DataSorter
 * @brief This class implements various sorting algorithms for the Data Analysis Engine component of Microsoft Excel.
 * 
 * The DataSorter class provides an interface for sorting data in the Data Analysis Engine.
 * It includes implementations of different sorting algorithms and methods for sorting
 * various data types and structures.
 */
template <typename T>
class DataSorter {
public:
    /**
     * @brief Sorts a vector of data using the default C++ sorting algorithm.
     * 
     * @param data The vector of data to be sorted.
     * @param ascending True for ascending order, false for descending order.
     */
    static void SortData(std::vector<T>& data, bool ascending = true) {
        if (ascending) {
            std::sort(data.begin(), data.end());
        } else {
            std::sort(data.begin(), data.end(), std::greater<T>());
        }
    }

    /**
     * @brief Implements the QuickSort algorithm for sorting data.
     * 
     * @param data The vector of data to be sorted.
     * @param low The starting index of the range to be sorted.
     * @param high The ending index of the range to be sorted.
     * @param ascending True for ascending order, false for descending order.
     */
    static void QuickSort(std::vector<T>& data, int low, int high, bool ascending = true) {
        if (low < high) {
            int pi = Partition(data, low, high, ascending);
            QuickSort(data, low, pi - 1, ascending);
            QuickSort(data, pi + 1, high, ascending);
        }
    }

    /**
     * @brief Implements the MergeSort algorithm for sorting data.
     * 
     * @param data The vector of data to be sorted.
     * @param left The starting index of the range to be sorted.
     * @param right The ending index of the range to be sorted.
     * @param ascending True for ascending order, false for descending order.
     */
    static void MergeSort(std::vector<T>& data, int left, int right, bool ascending = true) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            MergeSort(data, left, mid, ascending);
            MergeSort(data, mid + 1, right, ascending);
            Merge(data, left, mid, right, ascending);
        }
    }

    /**
     * @brief Implements the HeapSort algorithm for sorting data.
     * 
     * @param data The vector of data to be sorted.
     * @param ascending True for ascending order, false for descending order.
     */
    static void HeapSort(std::vector<T>& data, bool ascending = true) {
        int n = data.size();

        // Build heap
        for (int i = n / 2 - 1; i >= 0; i--)
            Heapify(data, n, i, ascending);

        // Extract elements from heap one by one
        for (int i = n - 1; i > 0; i--) {
            std::swap(data[0], data[i]);
            Heapify(data, i, 0, ascending);
        }
    }

    /**
     * @brief Sorts a 2D vector (table) based on a specific column.
     * 
     * @param data The 2D vector to be sorted.
     * @param columnIndex The index of the column to sort by.
     * @param ascending True for ascending order, false for descending order.
     */
    static void SortByColumn(std::vector<std::vector<T>>& data, int columnIndex, bool ascending = true) {
        std::sort(data.begin(), data.end(),
            [columnIndex, ascending](const std::vector<T>& a, const std::vector<T>& b) {
                if (ascending)
                    return a[columnIndex] < b[columnIndex];
                else
                    return a[columnIndex] > b[columnIndex];
            });
    }

private:
    /**
     * @brief Partition function used by QuickSort.
     */
    static int Partition(std::vector<T>& data, int low, int high, bool ascending) {
        T pivot = data[high];
        int i = (low - 1);

        for (int j = low; j <= high - 1; j++) {
            if ((ascending && data[j] < pivot) || (!ascending && data[j] > pivot)) {
                i++;
                std::swap(data[i], data[j]);
            }
        }
        std::swap(data[i + 1], data[high]);
        return (i + 1);
    }

    /**
     * @brief Merge function used by MergeSort.
     */
    static void Merge(std::vector<T>& data, int left, int mid, int right, bool ascending) {
        int n1 = mid - left + 1;
        int n2 = right - mid;

        std::vector<T> L(n1), R(n2);

        for (int i = 0; i < n1; i++)
            L[i] = data[left + i];
        for (int j = 0; j < n2; j++)
            R[j] = data[mid + 1 + j];

        int i = 0, j = 0, k = left;

        while (i < n1 && j < n2) {
            if ((ascending && L[i] <= R[j]) || (!ascending && L[i] >= R[j])) {
                data[k] = L[i];
                i++;
            } else {
                data[k] = R[j];
                j++;
            }
            k++;
        }

        while (i < n1) {
            data[k] = L[i];
            i++;
            k++;
        }

        while (j < n2) {
            data[k] = R[j];
            j++;
            k++;
        }
    }

    /**
     * @brief Heapify function used by HeapSort.
     */
    static void Heapify(std::vector<T>& data, int n, int i, bool ascending) {
        int largest = i;
        int l = 2 * i + 1;
        int r = 2 * i + 2;

        if (ascending) {
            if (l < n && data[l] > data[largest])
                largest = l;
            if (r < n && data[r] > data[largest])
                largest = r;
        } else {
            if (l < n && data[l] < data[largest])
                largest = l;
            if (r < n && data[r] < data[largest])
                largest = r;
        }

        if (largest != i) {
            std::swap(data[i], data[largest]);
            Heapify(data, n, largest, ascending);
        }
    }
};

} // namespace Microsoft::Excel::DataAnalysis

#endif // DATA_SORTER_H