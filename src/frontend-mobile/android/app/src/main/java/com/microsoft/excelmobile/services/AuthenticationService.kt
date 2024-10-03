package com.microsoft.excelmobile.services

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKeys
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class AuthenticationService(private val context: Context) {
    private val networkingProtocol: NetworkingProtocol = NetworkingProtocol()
    private val encryptedSharedPreferences: EncryptedSharedPreferences

    init {
        val masterKeyAlias = MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC)
        encryptedSharedPreferences = EncryptedSharedPreferences.create(
            "auth_prefs",
            masterKeyAlias,
            context,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        ) as EncryptedSharedPreferences
    }

    suspend fun login(username: String, password: String): Boolean = withContext(Dispatchers.IO) {
        try {
            val result = networkingProtocol.authenticate(username, password)
            if (result.isSuccessful) {
                saveAuthToken(result.token)
                true
            } else {
                false
            }
        } catch (e: Exception) {
            // Log the error
            false
        }
    }

    suspend fun logout() = withContext(Dispatchers.IO) {
        clearAuthToken()
        // Perform any necessary cleanup or server-side logout
        networkingProtocol.logout()
    }

    suspend fun getAuthToken(): String? = withContext(Dispatchers.IO) {
        encryptedSharedPreferences.getString("auth_token", null)
    }

    suspend fun refreshToken(): Boolean = withContext(Dispatchers.IO) {
        try {
            val result = networkingProtocol.refreshToken()
            if (result.isSuccessful) {
                saveAuthToken(result.token)
                true
            } else {
                false
            }
        } catch (e: Exception) {
            // Log the error
            false
        }
    }

    fun isLoggedIn(): Boolean {
        return getAuthToken() != null
    }

    private fun saveAuthToken(token: String) {
        encryptedSharedPreferences.edit().putString("auth_token", token).apply()
    }

    private fun clearAuthToken() {
        encryptedSharedPreferences.edit().remove("auth_token").apply()
    }
}

// Placeholder for NetworkingProtocol
// This should be replaced with the actual implementation once available
private class NetworkingProtocol {
    suspend fun authenticate(username: String, password: String): AuthResult {
        // Implement the actual authentication logic here
        return AuthResult(true, "dummy_token")
    }

    suspend fun refreshToken(): AuthResult {
        // Implement the actual token refresh logic here
        return AuthResult(true, "dummy_refreshed_token")
    }

    suspend fun logout() {
        // Implement the actual logout logic here
    }
}

private data class AuthResult(val isSuccessful: Boolean, val token: String)
```

This implementation of the AuthenticationService.kt file follows the specifications provided in the JSON representation. Here's a breakdown of the key components:

1. The class uses EncryptedSharedPreferences for secure storage of authentication tokens.
2. It implements all the required functions: login, logout, getAuthToken, refreshToken, isLoggedIn, saveAuthToken, and clearAuthToken.
3. The functions are implemented as suspend functions to support asynchronous operations.
4. Error handling is included in the login and refreshToken functions.
5. The NetworkingProtocol is implemented as a placeholder class since we don't have the actual implementation. It should be replaced with the real implementation once available.
6. The AuthResult data class is used to represent the result of authentication and token refresh operations.

Note that this implementation assumes that the NetworkingProtocol will be implemented later. You should replace the placeholder NetworkingProtocol class with the actual implementation when it becomes available.

Also, make sure to add the necessary dependencies for kotlinx.coroutines and androidx.security in your app's build.gradle file:

```gradle
dependencies {
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:1.5.2"
    implementation "androidx.security:security-crypto:1.1.0-alpha03"
}