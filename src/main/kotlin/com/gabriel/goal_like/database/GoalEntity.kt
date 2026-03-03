package com.gabriel.goal_like.database

import com.fasterxml.jackson.annotation.JsonIgnore
import com.gabriel.goal_like.domain.Goal
import com.gabriel.goal_like.domain.GoalStatus
import com.gabriel.goal_like.domain.TargetStatus
import com.gabriel.goal_like.domain.TargetType
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
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.rest.core.annotation.RestResource
import org.springframework.data.rest.core.config.Projection
import java.util.UUID


@Projection(types = [GoalEntity::class])
interface GoalSummary {
    val id: UUID
    val name: String
    val description: String
    val videoId: String
    val status: String
    val channel: String
    @get:Value("#{target.targetEntities}")
    val targets: List<TargetSummary>

    //val contentCreator: String
}
@Projection(types = [TargetEntity::class])
interface TargetSummary{
    val id: Long
    val amount: String
    val type: TargetType
    var status: TargetStatus
}

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
    @RestResource(path = "content-creator", rel = "content-creator")
    val contentCreator: ContentCreator,
    @OneToMany(mappedBy = "goal", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.EAGER)
    @RestResource(path = "targets", rel = "targets")
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