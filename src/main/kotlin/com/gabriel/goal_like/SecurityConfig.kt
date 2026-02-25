package com.gabriel.goal_like

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer.AuthorizationManagerRequestMatcherRegistry
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer
import org.springframework.security.web.SecurityFilterChain



@Configuration
@Profile("dev")
class SecurityConfig {
    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .authorizeHttpRequests { auth -> auth.anyRequest().permitAll() } // Permite todas as requisições
            .cors(Customizer.withDefaults()) // TODO TRATAR MELHOR para permitir o front-end e webhook
            .csrf { it.disable() } // Para H2 Console
            .headers { it.frameOptions { frameOp -> frameOp.disable() } } // Para H2 Console
        return http.build()
    }
}