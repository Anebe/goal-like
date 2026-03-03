package com.gabriel.goal_like.database

import com.fasterxml.jackson.annotation.JsonIgnore
import com.gabriel.goal_like.domain.TargetDomain
import com.gabriel.goal_like.domain.TargetStatus
import com.gabriel.goal_like.domain.TargetType
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne


@Entity
data class TargetEntity(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val amount: String,
    @Enumerated(value = EnumType.STRING)
    val type: TargetType,
    @Enumerated(EnumType.STRING)
    var status: TargetStatus,
    @ManyToOne
    @JoinColumn(name = "goal_id")
    var goal: GoalEntity,
){
    constructor(targetDomain: TargetDomain, goalEntity: GoalEntity): this(
        id = targetDomain.id,
        amount = targetDomain.amount,
        type = targetDomain.type,
        status = targetDomain.status,
        goal = goalEntity
    )
    fun to() = TargetDomain(
        id = id,
        amount = amount,
        type = type,
        status = status,
    )
}