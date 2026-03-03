package com.gabriel.goal_like.configuration

import com.gabriel.goal_like.DiscordProperties
import com.gabriel.goal_like.FirebaseProperties
import com.gabriel.goal_like.notification.EmailNotifier
import com.gabriel.goal_like.notification.Notifier
import com.gabriel.goal_like.notification.SimpleNotifier
import io.swagger.v3.oas.models.Components
import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.security.SecurityRequirement
import io.swagger.v3.oas.models.security.SecurityScheme
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.web.reactive.function.client.WebClient
@EnableConfigurationProperties(DiscordProperties::class, FirebaseProperties::class)
@Configuration
class DependenceInjectionConfig {

//    @Bean
//    @ConditionalOnProperty(prefix = "notification", name = ["email:mock"], havingValue = "true")
//    fun mockNotifier(): Notifier = SimpleNotifier()
//
//    @Bean
//    @ConditionalOnProperty(prefix = "notification", name = ["email:mock"], havingValue = "false")
//    fun emailNotifier(mailSender: JavaMailSender): Notifier = EmailNotifier(mailSender)


    @Bean
    fun discordWebClient(): WebClient {
        return WebClient.builder()
            .baseUrl("https://discord.com/api/v10")
            .build()
    }

    @Bean
    fun openAPI(): OpenAPI {
        return OpenAPI()
            .components(
                Components().addSecuritySchemes(
                    "cookieAuth",
                    SecurityScheme()
                        .type(SecurityScheme.Type.APIKEY)
                        .`in`(SecurityScheme.In.COOKIE)
                        .name("AUTH_TOKEN")
                )
            )
            .addSecurityItem(SecurityRequirement().addList("cookieAuth"))
    }
}
