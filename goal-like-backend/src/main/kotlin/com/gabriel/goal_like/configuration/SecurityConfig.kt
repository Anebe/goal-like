package com.gabriel.goal_like.configuration

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.OncePerRequestFilter


@Configuration
@Profile("dev")
@EnableMethodSecurity
class SecurityConfig(
    private val firebaseAuthFilter: OncePerRequestFilter
) {
    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .authorizeHttpRequests { auth ->
//                auth.anyRequest().permitAll()
                auth.requestMatchers("/api/v1/auth/**").permitAll()
//                auth.requestMatchers("/api/v1/content-creator/me").hasRole("USER")
//                auth.anyRequest().hasRole("ADMIN")
                auth.requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                auth.anyRequest().authenticated()
            }
            .cors(Customizer.withDefaults()) // TODO TRATAR MELHOR para permitir o front-end e webhook
            .csrf { it.disable() } // Para H2 Console
            .headers { it.frameOptions { frameOp -> frameOp.disable() } } // Para H2 Console
            .addFilterBefore(firebaseAuthFilter,
                UsernamePasswordAuthenticationFilter::class.java)
        return http.build()
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {

        val config = CorsConfiguration()

        config.allowedOrigins = listOf("http://localhost:3000") // frontend
        config.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        config.allowedHeaders = listOf("*")
        config.allowCredentials = true

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", config)

        return source
    }

}