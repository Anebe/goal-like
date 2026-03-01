package com.gabriel.goal_like.database

import com.gabriel.goal_like.domain.Goal
import com.gabriel.goal_like.domain.GoalStatus
import com.gabriel.goal_like.notification.ChannelType
import jakarta.persistence.CascadeType
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import org.springframework.data.rest.core.annotation.RestResource
import java.util.UUID


@Entity
class GoalEntity(
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,
    val name: String,
    val description: String?,
    val videoId: String,
    @Enumerated(EnumType.STRING)
    var status: GoalStatus,
    @Enumerated(EnumType.STRING)
    val channel: ChannelType,
    @ManyToOne
    @JoinColumn(name = "content_creator_id")
    @RestResource(exported = false)
    val contentCreator: ContentCreator,
    @OneToMany(mappedBy = "goal", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.EAGER)
    var targetEntities: Set<TargetEntity>? = null
) {
    constructor(goal: Goal) : this(
        id = goal.id,
        name = goal.name,
        description = goal.description,
        videoId = goal.videoId,
        status = goal.status,
        channel = goal.channel,
        contentCreator = goal.contentCreator,
    ){
        this.targetEntities = goal.targetEntities
            .map { TargetEntity(it, this) }
            .toMutableSet()
    }

    fun to() = Goal(
        id = id,
        name = name,
        description = description,
        videoId = videoId,
        status = status,
        channel = channel,
        contentCreator = contentCreator,
        targetEntities = targetEntities?.map { it.to() }?.toMutableSet() ?: throw IllegalStateException()
    )
}