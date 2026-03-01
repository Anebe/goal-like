package com.gabriel.goal_like.domain

import com.gabriel.goal_like.database.ContentCreator
import com.gabriel.goal_like.notification.ChannelType
import java.time.LocalDateTime
import java.util.UUID

class Goal(
    val id: UUID? = null,
    val name: String,
    val description: String?,
    val videoId: String,
    var status: GoalStatus,
    val channel: ChannelType,
    val contentCreator: ContentCreator,
    val targetEntities: MutableSet<TargetDomain> = mutableSetOf()

) {

    fun check(actualLike: Long, onTrigger: (GoalEvent) -> Unit){
        val goalId = id ?: throw IllegalStateException("Goal need be have a id")
        for (target in targetEntities) {
            target.hasAchieved(actualLike, goalId) { target, goalEvent ->
                if (target.type == TargetType.GOAL_DESIRE)
                    this.status = GoalStatus.COMPLETED
                if (target.type == TargetType.DEADLINE)
                    this.status = GoalStatus.EXPIRED

                onTrigger(goalEvent)
            }

        }
    }
}

enum class GoalStatus {
    ACTIVE,      // Meta válida e contando
    COMPLETED,   // Atingiu o objetivo
    EXPIRED,     // Deadline passou sem atingir
    CANCELLED    // Cancelada manualmente
}

enum class GoalEventType{
    GOAL_COMPLETED,
    GOAL_FAILED,
    GOAL_PROGRESS,
    GOAL_DEADLINE_NEAR
}
class GoalEvent(
    val goalId: UUID,
    val type: GoalEventType,
    val data: Map<String, Any>,
) {

}