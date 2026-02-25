package com.gabriel.goal_like.notification

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Component

class SimpleNotifier : Notifier{
    override fun sendNotification() {
        println("NOTIFICADO")
    }
}