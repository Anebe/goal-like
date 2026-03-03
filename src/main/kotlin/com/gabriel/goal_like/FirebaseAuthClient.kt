package com.gabriel.goal_like

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import tools.jackson.databind.annotation.JsonSerialize


@ConfigurationProperties(prefix = "firebase")
data class FirebaseProperties(
    val type: String,
    val project_id: String,
    val private_key_id: String,
    var private_key: String,
    val client_email: String,
    val client_id: String,
    val auth_uri: String,
    val token_uri: String,
    val auth_provider_x509_cert_url: String,
    val client_x509_cert_url: String,
    val universe_domain: String,
    val apiKey: String,
)

data class FirebaseLoginRequest(
    val email: String,
    val password: String,
    val returnSecureToken: Boolean
)

data class FirebaseLoginResponse(
    val idToken: String,
    val refreshToken: String,
    val expiresIn: String,
    val localId: String,
    val email: String
)

@Service
class FirebaseAuthClient(
    private val props: FirebaseProperties
) {

    private val webClient = WebClient.builder().baseUrl(
        "https://identitytoolkit.googleapis.com/v1"
    ).build()

    fun login(email: String, password: String): FirebaseLoginResponse {

        val response = webClient.post()
            .uri { uri ->
                uri.path("/accounts:signInWithPassword")
                    .queryParam("key", props.apiKey)
                    .build()
            }
            .bodyValue(
                FirebaseLoginRequest(
                    email = email,
                    password = password,
                    returnSecureToken = true
                )
            )
            .retrieve()
            .bodyToMono(FirebaseLoginResponse::class.java)
            .block()

        return response!!
    }
}