package com.gabriel.goal_like

import com.gabriel.goal_like.content.YoutubeClient
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class CronJob(
    private val goalLikeService: GoalLikeService,
) {

    @Scheduled(cron = "*/5 * * * * *")
    fun whatTimeIs(){
        goalLikeService.process()
    }
}
