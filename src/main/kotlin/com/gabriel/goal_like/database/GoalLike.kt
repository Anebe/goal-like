package com.gabriel.goal_like.database

import jakarta.annotation.Generated
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.EnumeratedValue
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import java.time.LocalDateTime
import java.util.UUID

enum class GoalStatus {
    ACTIVE,      // Meta válida e contando
    COMPLETED,   // Atingiu o objetivo
    EXPIRED,     // Deadline passou sem atingir
    CANCELLED    // Cancelada manualmente
}
@Entity
data class GoalLike(
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID,
    val name: String,
    val description: String?,
    val deadline: LocalDateTime,
    val goalLikeQtd: Long,//TODO remover e usar somente os reminders
    val videoId: String,
    @Enumerated(EnumType.STRING)
    val status: GoalStatus,
    //val reminders: List<Reminder>

)

enum class ReminderValueType{
    PORCENTAGE,
    TIME_REMAINING,
    NUMBER_OF_LIKES
}
@Entity
class Reminder(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,
    val amount: String,
    @Enumerated(value = EnumType.STRING)
    val type: ReminderValueType,
)