package com.gabriel.goal_like.notification

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Component


class EmailNotifier(
    private val mailSender: JavaMailSender
): Notifier {
    override fun sendNotification() {
        sendSimpleEmail("gabriel2001barros@gmail.com", "META ATINGIDA", "FOI")
    }

    private fun sendSimpleEmail(to: String, subject: String, text: String) {
        val message = SimpleMailMessage()
        message.setTo(to)
        message.subject = subject
        message.text = text

        mailSender.send(message)
    }
}