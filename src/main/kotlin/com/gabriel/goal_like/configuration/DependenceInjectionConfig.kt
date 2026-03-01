package com.gabriel.goal_like.configuration

import com.gabriel.goal_like.notification.EmailNotifier
import com.gabriel.goal_like.notification.Notifier
import com.gabriel.goal_like.notification.SimpleNotifier
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.mail.javamail.JavaMailSender

//@Configuration
//class DependenceInjectionConfig {
//
//    @Bean
//    @ConditionalOnProperty(prefix = "notification", name = ["email:mock"], havingValue = "true")
//    fun mockNotifier(): Notifier = SimpleNotifier()
//
//    @Bean
//    @ConditionalOnProperty(prefix = "notification", name = ["email:mock"], havingValue = "false")
//    fun emailNotifier(mailSender: JavaMailSender): Notifier = EmailNotifier(mailSender)
//
//}