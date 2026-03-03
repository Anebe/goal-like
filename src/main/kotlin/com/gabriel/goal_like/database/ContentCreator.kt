package com.gabriel.goal_like.database

import jakarta.persistence.CascadeType
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import org.checkerframework.common.aliasing.qual.Unique
import org.springframework.data.rest.core.annotation.RestResource
import org.springframework.data.rest.core.config.Projection
import java.util.UUID


@Projection(types = [ContentCreator::class])
interface ContentCreatorSummary{
    val id: UUID
    val fullName: String
    var contacts: Set<ContactSummary>
}
@Entity
class ContentCreator(
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,
    val fullName: String,
    @OneToMany(mappedBy = "contentCreator", cascade = [CascadeType.ALL], orphanRemoval = true)
    @RestResource(path = "goals", rel = "goals")
    val goalEntities: List<GoalEntity> = emptyList(),
    @OneToMany(mappedBy = "contentCreator", cascade = [CascadeType.ALL], orphanRemoval = true)
    var contacts: Set<Contact> = emptySet(),
    var authId: String? = null,
) {
    constructor(contentCreator: ContentCreator, contacts: Set<Contact>): this(
        id = contentCreator.id,
        fullName = contentCreator.fullName,
        goalEntities = contentCreator.goalEntities,
        contacts = contacts,
    )
}