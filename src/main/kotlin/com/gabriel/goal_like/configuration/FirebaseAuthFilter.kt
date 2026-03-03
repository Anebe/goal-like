package com.gabriel.goal_like.configuration

import com.google.firebase.auth.FirebaseAuth
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class FirebaseAuthFilter : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {

        val token = getTokenFromHeader(request) ?: getTokenFromCookie(request)

        if (token != null) {
            try {
                val decoded = FirebaseAuth.getInstance().verifyIdToken(token)
                val isAdmin = decoded.claims["admin"] as? Boolean ?: false
                val authorities = mutableListOf<GrantedAuthority>()
                if (isAdmin) authorities.add(SimpleGrantedAuthority("ROLE_ADMIN"))
                else authorities.add(SimpleGrantedAuthority("ROLE_USER"))

                val auth = UsernamePasswordAuthenticationToken(
                    decoded.uid,
                    null,
                    authorities
                )

                SecurityContextHolder.getContext().authentication = auth

            } catch (e: Exception) {
                // token inválido
            }
        }

        filterChain.doFilter(request, response)
    }

    private fun getTokenFromHeader(request: HttpServletRequest): String? {
        val header = request.getHeader("Authorization")
        return if (header != null && header.startsWith("Bearer ")) {
            header.substring(7)
        } else null
    }

    private fun getTokenFromCookie(request: HttpServletRequest): String? {
        return request.cookies
            ?.firstOrNull { it.name == "AUTH_TOKEN" }
            ?.value
    }
}