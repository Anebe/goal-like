package com.gabriel.goal_like.notification

enum class ChannelType {
    EMAIL,
    SMS,
    DISCORD,
    PUSH,
    MOCK
}
data class Message(
    val title: String,
    val body: String,
)
interface Notifier{
    val tipo: ChannelType
    fun sendNotification(to: String, message: Message)
}