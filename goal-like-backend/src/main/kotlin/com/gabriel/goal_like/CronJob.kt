package com.gabriel.goal_like

import com.gabriel.goal_like.content.YoutubeClient
import jakarta.transaction.Transactional
import org.springframework.context.annotation.Profile
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
@Profile("dev")
class CronJobForDev(
    private val goalLikeService: GoalLikeService,
) {

    @Transactional //Scheduled não consegue carregar LAZY de reminders
    @Scheduled(cron = "*/5 * * * * *")
    fun verifyGoals(){
        goalLikeService.process()
    }
}

@Component
@Profile("prod")
class CronJob(
    private val goalLikeService: GoalLikeService,
) {

    @Scheduled(cron = "0 * * * * *")
    fun verifyGoals(){
        goalLikeService.process()
    }
}

