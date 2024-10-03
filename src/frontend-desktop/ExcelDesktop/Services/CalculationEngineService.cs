using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExcelDesktop.Services
{
    /// <summary>
    /// This class provides an interface to the Excel calculation engine, handling formula parsing, evaluation, and result caching.
    /// </summary>
    public class CalculationEngineService
    {
        private readonly CoreEngineService _coreEngineService;
        private readonly ICalculationEngine _calculationEngine;
        private readonly Dictionary<string, object> _cache;

        /// <summary>
        /// Initializes a new instance of the CalculationEngineService class.
        /// </summary>
        /// <param name="coreEngineService">The core engine service.</param>
        /// <param name="calculationEngine">The calculation engine interface.</param>
        public CalculationEngineService(CoreEngineService coreEngineService, ICalculationEngine calculationEngine)
        {
            _coreEngineService = coreEngineService ?? throw new ArgumentNullException(nameof(coreEngineService));
            _calculationEngine = calculationEngine ?? throw new ArgumentNullException(nameof(calculationEngine));
            _cache = new Dictionary<string, object>();
        }

        /// <summary>
        /// Parses the given formula and returns a normalized version.
        /// </summary>
        /// <param name="formula">The formula to parse.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a normalized version of the formula.</returns>
        public async Task<string> ParseFormula(string formula)
        {
            if (string.IsNullOrWhiteSpace(formula))
            {
                throw new ArgumentException("Formula cannot be null or empty.", nameof(formula));
            }

            try
            {
                return await _calculationEngine.ParseFormulaAsync(formula);
            }
            catch (Exception ex)
            {
                throw new CalculationEngineException("Error parsing formula.", ex);
            }
        }

        /// <summary>
        /// Evaluates the given formula in the context of the specified worksheet and returns the result.
        /// </summary>
        /// <param name="formula">The formula to evaluate.</param>
        /// <param name="worksheetId">The ID of the worksheet in which to evaluate the formula.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the result of the formula evaluation.</returns>
        public async Task<object> EvaluateFormula(string formula, string worksheetId)
        {
            if (string.IsNullOrWhiteSpace(formula))
            {
                throw new ArgumentException("Formula cannot be null or empty.", nameof(formula));
            }

            if (string.IsNullOrWhiteSpace(worksheetId))
            {
                throw new ArgumentException("Worksheet ID cannot be null or empty.", nameof(worksheetId));
            }

            string cacheKey = $"{worksheetId}:{formula}";

            if (_cache.TryGetValue(cacheKey, out object cachedResult))
            {
                return cachedResult;
            }

            try
            {
                object result = await _calculationEngine.EvaluateFormulaAsync(formula, worksheetId);
                _cache[cacheKey] = result;
                return result;
            }
            catch (Exception ex)
            {
                throw new CalculationEngineException("Error evaluating formula.", ex);
            }
        }

        /// <summary>
        /// Recalculates all formulas in the specified worksheet.
        /// </summary>
        /// <param name="worksheetId">The ID of the worksheet to recalculate.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        public async Task RecalculateWorksheet(string worksheetId)
        {
            if (string.IsNullOrWhiteSpace(worksheetId))
            {
                throw new ArgumentException("Worksheet ID cannot be null or empty.", nameof(worksheetId));
            }

            try
            {
                await _calculationEngine.RecalculateWorksheetAsync(worksheetId);
                ClearCache(worksheetId);
            }
            catch (Exception ex)
            {
                throw new CalculationEngineException("Error recalculating worksheet.", ex);
            }
        }

        /// <summary>
        /// Clears the calculation cache.
        /// </summary>
        /// <param name="worksheetId">Optional. If provided, clears only the cache for the specified worksheet.</param>
        public void ClearCache(string worksheetId = null)
        {
            if (string.IsNullOrWhiteSpace(worksheetId))
            {
                _cache.Clear();
            }
            else
            {
                var keysToRemove = new List<string>();
                foreach (var key in _cache.Keys)
                {
                    if (key.StartsWith($"{worksheetId}:"))
                    {
                        keysToRemove.Add(key);
                    }
                }
                foreach (var key in keysToRemove)
                {
                    _cache.Remove(key);
                }
            }
        }
    }

    /// <summary>
    /// Custom exception for CalculationEngineService errors.
    /// </summary>
    public class CalculationEngineException : Exception
    {
        public CalculationEngineException(string message) : base(message) { }
        public CalculationEngineException(string message, Exception innerException) : base(message, innerException) { }
    }
}