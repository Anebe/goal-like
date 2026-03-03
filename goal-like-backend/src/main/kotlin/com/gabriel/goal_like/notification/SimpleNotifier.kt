package com.gabriel.goal_like.notification

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.context.annotation.Scope
import org.springframework.stereotype.Component

@Component
class SimpleNotifier : Notifier{
    override val tipo = ChannelType.MOCK

    override fun sendNotification(to: String, message: Message) {
        println("---${message.title}---")
        println("/t$to")
        println(message.body)
    }
}