package com.gabriel.goal_like

import com.gabriel.goal_like.database.GoalLikeRepository
import com.gabriel.goal_like.content.YoutubeClient
import com.gabriel.goal_like.database.GoalStatus
import com.gabriel.goal_like.notification.Notifier
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service

@Service
class GoalLikeService(
    private val goalLikeRepository: GoalLikeRepository,
    private val notifier: Notifier,
    private val youtubeClient: YoutubeClient//TODO trocar por interface
) {

    fun process(){
        //TODO melhorar a combinação das duas collection(ex:refatorar findall pra map<videoid,video>, criar class que junta as duas)
        val goals = goalLikeRepository.findAll()

        if (goals.isEmpty())
            return

        val videosIds = goals
            .filter { it.status == GoalStatus.ACTIVE }
            .map { it.videoId }.toList()

        val videosLikes = youtubeClient.howManyLikesOfVideos(videosIds)
        for (goal in goals) {
            val likeqtd  = videosLikes[goal.videoId]?: continue
            val goalLike = goal.goalLikeQtd
            if (likeqtd > goalLike){
                val updateGoal = goal.copy(status = GoalStatus.COMPLETED)
                goalLikeRepository.save(updateGoal)
                notifier.sendNotification()//TODO remover daqui e tornar independer e async
            }
        }
    }
}



