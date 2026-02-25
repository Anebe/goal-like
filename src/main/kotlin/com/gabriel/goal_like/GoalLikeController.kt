package com.gabriel.goal_like

import com.gabriel.goal_like.database.GoalLike
import com.gabriel.goal_like.database.GoalLikeRepository
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class GoalLikeController(
    private val goalLikeRepository: GoalLikeRepository
) {


    @PostMapping
    fun insertGoalLike(
        @RequestBody goalLike: GoalLike){

        goalLikeRepository.save(goalLike)
    }
}