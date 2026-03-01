package com.gabriel.goal_like.database

import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource
import org.springframework.data.rest.core.annotation.RestResource
import java.util.UUID

@RepositoryRestResource(path = "goal")
@Tag(name = "Goal")
interface GoalRepository : JpaRepository<GoalEntity, UUID>{

    @RestResource(exported = false)
    fun findByContentCreatorId(id: UUID): List<GoalEntity>

    @RestResource(exported = false)
    fun save(goal: GoalEntity): GoalEntity
}