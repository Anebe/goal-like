package com.gabriel.goal_like.database

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface GoalLikeRepository : JpaRepository<GoalLike, UUID>{
}