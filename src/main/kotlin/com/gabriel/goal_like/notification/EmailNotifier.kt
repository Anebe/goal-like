package com.gabriel.goal_like.notification

import com.gabriel.goal_like.database.ContentCreatorRepository
import org.springframework.context.annotation.Scope
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Component

@Component
@Scope("prototype")
class EmailNotifier(
    private val mailSender: JavaMailSender,
    private val contentCreatorRepository: ContentCreatorRepository
): Notifier {
    override val tipo = ChannelType.EMAIL

    override fun sendNotification(to: String, message: Message) {
        val mailMessage = SimpleMailMessage()
        mailMessage.setTo(to)
        mailMessage.subject = message.title
        mailMessage.text = message.body

        mailSender.send(mailMessage)
    }


}