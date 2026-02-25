package com.gabriel.goal_like.content

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport
import com.google.api.services.youtube.YouTube
import com.google.api.client.json.jackson2.JacksonFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component

@Component
class YoutubeClient(
    @Value("\${youtube.api-key}")
    private val apiKey: String
) {
    private val youtube = YouTube.Builder(
            GoogleNetHttpTransport.newTrustedTransport(),
            JacksonFactory.getDefaultInstance(),
            null
        ).setApplicationName("my-app")
            .build()

    fun howManyLikesOfVideos(videosIds: List<String>): Map<String, Long>{


        val request = youtube.videos().list("statistics")
        request.id = videosIds.joinToString(",")
        request.key = apiKey
        val response = request.execute()
        val result = mutableMapOf<String, Long>()
        for (video in response.items){
            result[video.id] = video.statistics.likeCount.toLong()
        }
        return result
    }
}