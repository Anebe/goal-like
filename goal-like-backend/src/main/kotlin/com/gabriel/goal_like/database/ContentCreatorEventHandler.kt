package com.gabriel.goal_like.database

import org.springframework.data.rest.core.annotation.HandleBeforeDelete
import org.springframework.data.rest.core.annotation.HandleBeforeSave
import org.springframework.data.rest.core.annotation.RepositoryEventHandler
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component

@RepositoryEventHandler(ContentCreator::class)
@Component
class ContentCreatorEventHandler {

    @HandleBeforeDelete
    fun beforeDelete(entity: ContentCreator) {
        // UID do token
        SecurityContextHolder.getContext().authentication?.let { tryPermission(entity, it) }
    }

    @HandleBeforeSave
    fun beforeSave(entity: ContentCreator) {
        SecurityContextHolder.getContext().authentication?.let { tryPermission(entity, it) }

    }

    private fun tryPermission(entity: ContentCreator, auth: Authentication){
        val uid = auth.name
        if (auth.authorities.any { it.authority != "ROLE_ADMIN" } && entity.authId != uid) throw AccessDeniedException("Cannot interact other users")
    }
}

@RepositoryEventHandler(GoalEntity::class)
@Component
class GoalEventHandler {

    @HandleBeforeDelete
    fun beforeDelete(entity: GoalEntity) {
        // UID do token
        SecurityContextHolder.getContext().authentication?.let { tryPermission(entity, it) }
    }

    @HandleBeforeSave
    fun beforeSave(entity: GoalEntity) {
        SecurityContextHolder.getContext().authentication?.let { tryPermission(entity, it) }

    }

    private fun tryPermission(entity: GoalEntity, auth: Authentication){
        val uid = auth.name
        if (auth.authorities.any { it.authority != "ROLE_ADMIN" } && entity.contentCreator.authId != uid) throw AccessDeniedException("Cannot interact other users")
    }
}

@RepositoryEventHandler(Contact::class)
@Component
class ContactEventHandler {

    @HandleBeforeDelete
    fun beforeDelete(entity: Contact) {
        SecurityContextHolder.getContext().authentication?.let { tryPermission(entity, it) }
    }

    @HandleBeforeSave
    fun beforeSave(entity: Contact) {
        SecurityContextHolder.getContext().authentication?.let { tryPermission(entity, it) }

    }

    private fun tryPermission(entity: Contact, auth: Authentication){
        val uid = auth.name
        if (auth.authorities.any { it.authority != "ROLE_ADMIN" } && entity.contentCreator.authId != uid) throw AccessDeniedException("Cannot interact other users")
    }
}