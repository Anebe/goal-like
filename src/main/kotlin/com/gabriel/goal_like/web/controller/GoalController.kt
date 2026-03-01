package com.gabriel.goal_like.web.controller

import com.gabriel.goal_like.database.ContentCreatorRepository
import com.gabriel.goal_like.database.GoalRepository
import com.gabriel.goal_like.error.BusinessRuleException
import com.gabriel.goal_like.web.dto.GoalRequest
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.data.rest.webmvc.RepositoryRestController
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

//@RestController
//@RequestMapping("api/v1/goal")
@RepositoryRestController
@Tag(name = "Goal")
class GoalController(
    private val goalRepository: GoalRepository,
    private val contentCreatorRepository: ContentCreatorRepository
) {

    @PostMapping("goal")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun insertGoalLike(
        @RequestBody goal: GoalRequest
    ) {
        val contentCreator = contentCreatorRepository.findById(goal.contentCreatorId).orElseThrow { BusinessRuleException("There needs to be a content creation associate!") }

        goalRepository.save(goal.to(contentCreator))
    }
}