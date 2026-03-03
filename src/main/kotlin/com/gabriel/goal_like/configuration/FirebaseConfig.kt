package com.gabriel.goal_like.configuration

import com.gabriel.goal_like.FirebaseProperties
import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.gson.JsonStreamParser
import jakarta.annotation.PostConstruct
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource
import tools.jackson.databind.ObjectMapper
import java.io.ByteArrayInputStream
import java.io.FileInputStream
import java.io.InputStream
import java.util.Base64

@Configuration
class FirebaseConfig(
    private val props: FirebaseProperties,
) {

    @PostConstruct
    fun init() {
        val objectMapper = ObjectMapper()
        props.private_key = props.private_key.replace("\\n", "\n")
        val json = objectMapper.writeValueAsString(props)
        val inputStream = ByteArrayInputStream(json.toByteArray())
        val options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(inputStream))
            .build()

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options)
        }
    }
}