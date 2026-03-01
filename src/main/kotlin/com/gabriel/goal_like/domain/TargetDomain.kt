package com.gabriel.goal_like.domain

import java.time.LocalDateTime
import java.util.UUID

class TargetDomain (
    val id: Long? = null,
    val amount: String,
    val type: TargetType,
    var status: TargetStatus,
){

    fun hasAchieved(amountActual: Long, goalId: UUID, onAchieved: (TargetDomain, GoalEvent) -> Unit) {

        val target = this.id ?: throw IllegalStateException("Target need be have a id")
        when(type){
            TargetType.DEADLINE -> {
                if (LocalDateTime.now() >= LocalDateTime.parse(amount)) {
                    status = TargetStatus.COMPLETED
                    onAchieved(this, GoalEvent(
                        goalId,
                        GoalEventType.GOAL_FAILED,
                        mapOf("date" to LocalDateTime.now()) ))
                }
            }
            TargetType.NUMBER_OF_LIKES -> {
                if (amountActual >= amount.toLong()) {
                    status = TargetStatus.COMPLETED
                    onAchieved(this, GoalEvent(
                        goalId,
                        GoalEventType.GOAL_PROGRESS,
                        mapOf("likes" to amount)))
                }
            }
            TargetType.PERCENTAGE -> {
                if (amountActual >= amount.toLong()) {
                    status = TargetStatus.COMPLETED
                    onAchieved(this, GoalEvent(
                        goalId,
                        GoalEventType.GOAL_PROGRESS,
                        mapOf("percentage" to amount)))
                }

            }
            TargetType.GOAL_DESIRE -> {
                if (amountActual >= amount.toLong()) {
                    status = TargetStatus.COMPLETED
                    onAchieved(this, GoalEvent(
                        goalId,
                        GoalEventType.GOAL_COMPLETED,
                        emptyMap()))
                }
            }
            TargetType.DURATION -> {
                val date = LocalDateTime.parse(amount)
                if (LocalDateTime.now() >= date) {
                    status = TargetStatus.COMPLETED
                    onAchieved(this, GoalEvent(
                        goalId,
                        GoalEventType.GOAL_PROGRESS,
                        mapOf("days_to_end" to date)))
                }
            }
        }
    }
}


enum class TargetType{
    GOAL_DESIRE,
    DEADLINE,
    DURATION,
    PERCENTAGE,
    NUMBER_OF_LIKES,

}

enum class TargetStatus{
    ACTIVE,
    COMPLETED,
    CANCELLED
}