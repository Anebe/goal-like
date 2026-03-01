package com.gabriel.goal_like

import com.gabriel.goal_like.database.GoalRepository
import com.gabriel.goal_like.content.YoutubeClient
import com.gabriel.goal_like.database.GoalEntity
import com.gabriel.goal_like.domain.GoalStatus
import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Service

@Service
class GoalLikeService(
    private val goalRepository: GoalRepository,
    private val youtubeClient: YoutubeClient,//TODO trocar por interface
    private val publiser: ApplicationEventPublisher,
) {

    fun process(){
        val goalsEntity = goalRepository.findAll()

        if (goalsEntity.isEmpty())
            return

        val videosIds = goalsEntity
            .filter { it.status == GoalStatus.ACTIVE }
            .map { it.videoId }.toList()

        val videosLikes = youtubeClient.howManyLikesOfVideos(videosIds)
        for (goalEntity in goalsEntity) {
            val goal = goalEntity.to()
            val likeqtd  = videosLikes[goal.videoId]?: continue

            goal.check(likeqtd, { goalEvent ->
                publiser.publishEvent(goalEvent)
                goalRepository.save(GoalEntity(goal))
            })

        }
    }
}



