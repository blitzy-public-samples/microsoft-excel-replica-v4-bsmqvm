using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// This class manages the caching mechanism for the data access layer in Microsoft Excel,
    /// improving performance by storing frequently accessed data.
    /// </summary>
    public class CacheManager<T>
    {
        private const int DEFAULT_CACHE_SIZE = 1000;
        private const int DEFAULT_CACHE_EXPIRATION = 3600; // 1 hour in seconds

        private readonly Dictionary<string, (T Value, DateTime Timestamp)> _cache;
        private readonly object _lockObject = new object();

        /// <summary>
        /// Gets or sets the maximum number of items that can be stored in the cache.
        /// </summary>
        public int MaxCacheSize { get; set; }

        /// <summary>
        /// Gets or sets the expiration time for cached items in seconds.
        /// </summary>
        public int CacheExpirationSeconds { get; set; }

        /// <summary>
        /// Initializes a new instance of the CacheManager class with optional parameters for cache size and expiration time.
        /// </summary>
        /// <param name="maxCacheSize">The maximum number of items to store in the cache. Defaults to DEFAULT_CACHE_SIZE if not specified.</param>
        /// <param name="cacheExpirationSeconds">The expiration time for cached items in seconds. Defaults to DEFAULT_CACHE_EXPIRATION if not specified.</param>
        public CacheManager(int maxCacheSize = DEFAULT_CACHE_SIZE, int cacheExpirationSeconds = DEFAULT_CACHE_EXPIRATION)
        {
            MaxCacheSize = maxCacheSize;
            CacheExpirationSeconds = cacheExpirationSeconds;
            _cache = new Dictionary<string, (T Value, DateTime Timestamp)>();
        }

        /// <summary>
        /// Retrieves an item from the cache based on the provided key.
        /// </summary>
        /// <param name="key">The key of the item to retrieve from the cache.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the cached item of type T if found, otherwise null.</returns>
        public async Task<T> GetFromCache(string key)
        {
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException(nameof(key), "Cache key cannot be null or empty.");
            }

            lock (_lockObject)
            {
                if (_cache.TryGetValue(key, out var cachedItem))
                {
                    if (DateTime.UtcNow.Subtract(cachedItem.Timestamp).TotalSeconds < CacheExpirationSeconds)
                    {
                        return cachedItem.Value;
                    }
                    else
                    {
                        _cache.Remove(key);
                    }
                }
            }

            return default(T);
        }

        /// <summary>
        /// Adds an item to the cache with the specified key.
        /// </summary>
        /// <param name="key">The key to associate with the cached item.</param>
        /// <param name="value">The value to be cached.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        public async Task AddToCache(string key, T value)
        {
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException(nameof(key), "Cache key cannot be null or empty.");
            }

            lock (_lockObject)
            {
                if (_cache.Count >= MaxCacheSize)
                {
                    RemoveOldestItem();
                }

                _cache[key] = (value, DateTime.UtcNow);
            }
        }

        /// <summary>
        /// Removes an item from the cache based on the provided key.
        /// </summary>
        /// <param name="key">The key of the item to remove from the cache.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        public async Task RemoveFromCache(string key)
        {
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException(nameof(key), "Cache key cannot be null or empty.");
            }

            lock (_lockObject)
            {
                _cache.Remove(key);
            }
        }

        /// <summary>
        /// Clears all items from the cache.
        /// </summary>
        /// <returns>A task that represents the asynchronous operation.</returns>
        public async Task ClearCache()
        {
            lock (_lockObject)
            {
                _cache.Clear();
            }
        }

        /// <summary>
        /// Returns the current number of items in the cache.
        /// </summary>
        /// <returns>The number of items currently in the cache.</returns>
        public int GetCacheSize()
        {
            lock (_lockObject)
            {
                return _cache.Count;
            }
        }

        private void RemoveOldestItem()
        {
            string oldestKey = null;
            DateTime oldestTimestamp = DateTime.MaxValue;

            foreach (var item in _cache)
            {
                if (item.Value.Timestamp < oldestTimestamp)
                {
                    oldestKey = item.Key;
                    oldestTimestamp = item.Value.Timestamp;
                }
            }

            if (oldestKey != null)
            {
                _cache.Remove(oldestKey);
            }
        }
    }
}