package com.gabriel.goal_like.database

import jakarta.persistence.CascadeType
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import org.springframework.data.rest.core.annotation.RestResource
import java.util.UUID

@Entity
class ContentCreator(
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,
    val fullName: String,
    @OneToMany(mappedBy = "contentCreator", cascade = [CascadeType.ALL], orphanRemoval = true)
    @RestResource(path = "goals", rel = "goals")
    val goalEntities: List<GoalEntity> = emptyList(),
    @OneToMany(mappedBy = "contentCreator", cascade = [CascadeType.ALL], orphanRemoval = true)
    var contacts: Set<Contact> = emptySet()
) {
    constructor(contentCreator: ContentCreator, contacts: Set<Contact>): this(
        id = contentCreator.id,
        fullName = contentCreator.fullName,
        goalEntities = contentCreator.goalEntities,
        contacts = contacts,
    )
}