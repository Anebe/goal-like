package com.gabriel.goal_like.database

import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.rest.core.annotation.Description
import org.springframework.data.rest.core.annotation.RepositoryRestResource
import org.springframework.data.rest.core.annotation.RestResource
import org.springframework.stereotype.Repository
import java.util.UUID
@RepositoryRestResource(path = "content-creator")
@Tag(name = "Content Creator")
interface ContentCreatorRepository: JpaRepository<ContentCreator, UUID> {

    @RestResource(exported = false)
    fun save(entity: ContentCreator): ContentCreator
}