package com.gabriel.goal_like.configuration

import com.gabriel.goal_like.DiscordProperties
import com.gabriel.goal_like.notification.EmailNotifier
import com.gabriel.goal_like.notification.Notifier
import com.gabriel.goal_like.notification.SimpleNotifier
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.web.reactive.function.client.WebClient
@EnableConfigurationProperties(DiscordProperties::class)
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
}