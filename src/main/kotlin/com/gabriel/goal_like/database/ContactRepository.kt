package com.gabriel.goal_like.database

import com.gabriel.goal_like.notification.ChannelType
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource
import org.springframework.data.rest.core.annotation.RestResource
import org.springframework.security.access.prepost.PreAuthorize
import java.util.*


@Tag(name = "Contact")
@RepositoryRestResource(excerptProjection = ContactSummary::class)
interface ContactRepository : JpaRepository<Contact, Long> {

    @RestResource(exported = false)
    fun findByContentCreatorIdAndType(
        creatorId: UUID,
        type: ChannelType
    ): Contact?

    @RestResource(exported = false)
    fun findByContentCreatorId(id: UUID): List<Contact>

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    override fun findAll(pageable: Pageable): Page<Contact>

}