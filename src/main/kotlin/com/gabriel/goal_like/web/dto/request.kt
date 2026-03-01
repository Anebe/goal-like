package com.gabriel.goal_like.web.dto

import com.gabriel.goal_like.database.Contact
import com.gabriel.goal_like.database.ContentCreator
import com.gabriel.goal_like.database.GoalEntity
import com.gabriel.goal_like.database.TargetEntity
import com.gabriel.goal_like.domain.GoalStatus
import com.gabriel.goal_like.domain.TargetStatus
import com.gabriel.goal_like.domain.TargetType
import com.gabriel.goal_like.notification.ChannelType
import java.util.UUID
import kotlin.collections.forEach

data class ContentCreatorRequest(
    val fullName: String,
    val contacts: MutableSet<ContactRequest> = mutableSetOf(),
) {
    init {
        require(fullName.isNotBlank())
        require(contacts.isNotEmpty())
    }
    fun to(): ContentCreator {
        val contentCreator =  ContentCreator(fullName = fullName)
        val newContacts = contacts.map { it.to(contentCreator) }.toSet()
        contentCreator.contacts =  newContacts
        return contentCreator
    }
}



data class ContactRequest(
    val contact: String,
    val type: ChannelType,
) {
    init {
        require(contact.isNotBlank())
    }

    fun to(contentCreator: ContentCreator) = Contact(
        contact = contact,
        type = type,
        contentCreator = contentCreator
    )
}

data class GoalRequest(
    val name: String,
    val description: String?,
    val videoId: String,
    val channel: ChannelType,
    val contentCreatorId: UUID,
    val targets: Set<TargetRequest>,
){
    fun to(contentCreator: ContentCreator) : GoalEntity{
        var goalEntity = GoalEntity(
            name = name,
            description = description,
            videoId = videoId,
            status = GoalStatus.ACTIVE,
            channel = channel,
            contentCreator = contentCreator,
        )
        goalEntity.targetEntities = targets.map { it.to(goalEntity) }.toSet()
        return goalEntity
    }
}

data class TargetRequest(
    val amount: String,
    val type: TargetType,
){
    fun to(goalEntity: GoalEntity) = TargetEntity(
        amount = amount,
        type = type,
        status = TargetStatus.ACTIVE,
        goal = goalEntity
    )
}