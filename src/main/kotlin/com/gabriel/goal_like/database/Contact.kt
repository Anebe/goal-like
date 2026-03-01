package com.gabriel.goal_like.database

import com.gabriel.goal_like.notification.ChannelType
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import org.springframework.data.rest.core.annotation.RestResource

@Entity
data class Contact(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val contact: String,
    @Enumerated(EnumType.STRING)
    val type: ChannelType,
    @ManyToOne
    @JoinColumn(name = "content_creator_id")
    @RestResource(exported = false)
    val contentCreator: ContentCreator,
)
