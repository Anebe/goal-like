package com.gabriel.goal_like.database

import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.rest.core.annotation.Description
import org.springframework.data.rest.core.annotation.RepositoryRestResource
import org.springframework.data.rest.core.annotation.RestResource
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Repository
import java.util.UUID
@RepositoryRestResource(
    path = "content-creator",
    itemResourceRel = "content-creator",
    collectionResourceRel = "content-creators",
    excerptProjection = ContentCreatorSummary::class
)
@Tag(name = "Content Creator")
interface ContentCreatorRepository: JpaRepository<ContentCreator, UUID> {

    @RestResource(exported = false)
    fun save(entity: ContentCreator): ContentCreator

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    override fun findAll(pageable: Pageable): Page<ContentCreator>

    @RestResource(exported = false)
    fun findByAuthId(id: String): ContentCreator?
}