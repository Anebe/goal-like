package com.gabriel.goal_like.web.controller

import com.gabriel.goal_like.FirebaseAuthClient
import com.gabriel.goal_like.database.Contact
import com.gabriel.goal_like.database.ContentCreator
import com.gabriel.goal_like.database.ContentCreatorRepository
import com.gabriel.goal_like.error.ResourceNotFoundException
import com.gabriel.goal_like.notification.ChannelType
import com.gabriel.goal_like.web.dto.AuthRequest
import com.gabriel.goal_like.web.dto.LoginResponse
import com.gabriel.goal_like.web.dto.SinginRequest
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.UserRecord
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@Tag(name = "Authentication")
@RestController
@RequestMapping("api/v1/auth")
class AuthController(
    private val contentCreatorRepository: ContentCreatorRepository,
    private val firebaseAuthClient: FirebaseAuthClient,
) {

    @PostMapping("/login")
    fun login(
        @RequestBody auth: AuthRequest,
        response: HttpServletResponse,
    ): ResponseEntity<LoginResponse>{
        val firebaseResponse = firebaseAuthClient.login(auth.email, auth.password)

        val contentCreator = contentCreatorRepository.findByAuthId(firebaseResponse.localId)?.id?: throw ResourceNotFoundException("Content Create", auth.email)
        val cookie = Cookie("AUTH_TOKEN", firebaseResponse.idToken)
        cookie.isHttpOnly = true
        cookie.secure = true       // true em produção (HTTPS)
        cookie.path = "/"
        cookie.maxAge = 60 * 60    // 1h

        response.addCookie(cookie)

        return ResponseEntity.ok(LoginResponse(contentCreator))
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun signup(
        @RequestBody singin: SinginRequest,
        )  {

        val request = UserRecord.CreateRequest()
            .setEmail(singin.email)
            .setPassword(singin.password)
            .setEmailVerified(false)
            .setDisabled(false)

        val user = FirebaseAuth.getInstance().createUser(request)
        val claims = mapOf("user" to true)
        FirebaseAuth.getInstance().setCustomUserClaims(user.uid, claims)
        val contentCreator = ContentCreator(
            authId = user.uid,
            fullName = singin.fullname,
            )
        contentCreator.contacts = setOf(Contact(contact = user.email, type = ChannelType.EMAIL, contentCreator = contentCreator))
        contentCreatorRepository.save(contentCreator)
    }


}