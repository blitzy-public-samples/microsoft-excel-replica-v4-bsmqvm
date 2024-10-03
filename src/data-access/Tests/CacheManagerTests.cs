using System;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading;

namespace Microsoft.Excel.DataAccess.Tests
{
    [TestClass]
    public class CacheManagerTests
    {
        private CacheManager _cacheManager;

        [TestInitialize]
        public void TestInitialize()
        {
            // Initialize CacheManager with default settings
            _cacheManager = new CacheManager();
        }

        [TestMethod]
        public async Task TestCacheManagerInitialization()
        {
            // Arrange
            int defaultCacheSize = 100;
            TimeSpan defaultExpiration = TimeSpan.FromMinutes(5);

            // Act
            var cacheManager = new CacheManager(defaultCacheSize, defaultExpiration);

            // Assert
            Assert.IsNotNull(cacheManager);
            Assert.AreEqual(defaultCacheSize, cacheManager.MaxCacheSize);
            Assert.AreEqual(defaultExpiration, cacheManager.DefaultExpiration);
        }

        [TestMethod]
        public async Task TestAddToCache()
        {
            // Arrange
            string key = "testKey";
            string value = "testValue";

            // Act
            await _cacheManager.AddToCache(key, value);

            // Assert
            var cachedValue = await _cacheManager.GetFromCache(key);
            Assert.AreEqual(value, cachedValue);
        }

        [TestMethod]
        public async Task TestGetFromCache()
        {
            // Arrange
            string key = "testKey";
            string value = "testValue";
            await _cacheManager.AddToCache(key, value);

            // Act
            var cachedValue = await _cacheManager.GetFromCache(key);

            // Assert
            Assert.AreEqual(value, cachedValue);
        }

        [TestMethod]
        public async Task TestGetFromCache_NonExistentKey()
        {
            // Arrange
            string nonExistentKey = "nonExistentKey";

            // Act
            var cachedValue = await _cacheManager.GetFromCache(nonExistentKey);

            // Assert
            Assert.IsNull(cachedValue);
        }

        [TestMethod]
        public async Task TestRemoveFromCache()
        {
            // Arrange
            string key = "testKey";
            string value = "testValue";
            await _cacheManager.AddToCache(key, value);

            // Act
            await _cacheManager.RemoveFromCache(key);

            // Assert
            var cachedValue = await _cacheManager.GetFromCache(key);
            Assert.IsNull(cachedValue);
        }

        [TestMethod]
        public async Task TestClearCache()
        {
            // Arrange
            await _cacheManager.AddToCache("key1", "value1");
            await _cacheManager.AddToCache("key2", "value2");

            // Act
            await _cacheManager.ClearCache();

            // Assert
            Assert.IsNull(await _cacheManager.GetFromCache("key1"));
            Assert.IsNull(await _cacheManager.GetFromCache("key2"));
        }

        [TestMethod]
        public async Task TestCacheSize()
        {
            // Arrange
            int maxSize = 2;
            var cacheManager = new CacheManager(maxSize, TimeSpan.FromMinutes(5));

            // Act
            await cacheManager.AddToCache("key1", "value1");
            await cacheManager.AddToCache("key2", "value2");
            await cacheManager.AddToCache("key3", "value3");

            // Assert
            Assert.IsNull(await cacheManager.GetFromCache("key1"));
            Assert.IsNotNull(await cacheManager.GetFromCache("key2"));
            Assert.IsNotNull(await cacheManager.GetFromCache("key3"));
        }

        [TestMethod]
        public async Task TestCacheExpiration()
        {
            // Arrange
            TimeSpan expiration = TimeSpan.FromMilliseconds(100);
            var cacheManager = new CacheManager(100, expiration);

            // Act
            await cacheManager.AddToCache("key", "value");
            await Task.Delay(expiration.Add(TimeSpan.FromMilliseconds(50)));

            // Assert
            Assert.IsNull(await cacheManager.GetFromCache("key"));
        }

        [TestMethod]
        public async Task TestConcurrentAccess()
        {
            // Arrange
            int concurrentTasks = 100;
            var tasks = new Task[concurrentTasks];

            // Act
            for (int i = 0; i < concurrentTasks; i++)
            {
                int index = i;
                tasks[i] = Task.Run(async () =>
                {
                    await _cacheManager.AddToCache($"key{index}", $"value{index}");
                    var value = await _cacheManager.GetFromCache($"key{index}");
                    Assert.AreEqual($"value{index}", value);
                });
            }

            // Assert
            await Task.WhenAll(tasks);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public async Task TestAddToCache_NullKey()
        {
            // Act
            await _cacheManager.AddToCache(null, "value");
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public async Task TestGetFromCache_NullKey()
        {
            // Act
            await _cacheManager.GetFromCache(null);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public async Task TestRemoveFromCache_NullKey()
        {
            // Act
            await _cacheManager.RemoveFromCache(null);
        }
    }
}