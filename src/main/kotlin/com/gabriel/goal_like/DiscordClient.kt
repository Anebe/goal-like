package com.gabriel.goal_like

import com.gabriel.goal_like.notification.ChannelType
import com.gabriel.goal_like.notification.Message
import com.gabriel.goal_like.notification.Notifier
import com.google.api.client.util.Value
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono
import kotlin.jvm.java


//TODO pensar em uma maneira de guardar o link de permisão do usuario
//TODO tratar exception(caso o usuario não tenha dado permissão pro bot ou tenha removido ela)

data class DiscordChannelResponse(
    val id: String,
    val type: Int
)
@ConfigurationProperties(prefix = "discord")
data class DiscordProperties(
    val applicationId: String,
    val apiKey: String,
    val botToken: String
)
@Service
class DiscordClient(
    private val webClient: WebClient,
    private val discordProperties: DiscordProperties,
) : Notifier{

    override val tipo = ChannelType.DISCORD


    fun createDM(userId: String): Mono<DiscordChannelResponse> {
        return webClient.post()
            .uri("/users/@me/channels")
            .header("Authorization", "Bot ${discordProperties.botToken}")
            .bodyValue(mapOf("recipient_id" to userId))
            .retrieve()
            .bodyToMono(DiscordChannelResponse::class.java)
    }

    fun sendMessage(channelId: String, message: String){
        webClient.post()
            .uri("/channels/$channelId/messages")
            .header("Authorization", "Bot ${discordProperties.botToken}")
            .bodyValue(mapOf("content" to message))
            .retrieve()
            .toBodilessEntity()
            .block()
    }

    override fun sendNotification(to: String, message: Message) {
        println("DISCORD")
        val id = createDM(to)
            .map{
                it.id
            }.block() ?: throw IllegalStateException("Precisa do id do canal do discord")
        sendMessage(id, message.body)


    }
}

