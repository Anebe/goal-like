package com.gabriel.goal_like.web.controller

import com.gabriel.goal_like.database.ContactRepository
import com.gabriel.goal_like.database.ContentCreatorRepository
import com.gabriel.goal_like.error.ResourceNotFoundException
import com.gabriel.goal_like.web.dto.ContactRequest
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/contacts")
class ContactController(
    private val contactRepository: ContactRepository,
    private val contentCreatorRepository: ContentCreatorRepository,
) {

    @PostMapping    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun save(@RequestBody contact: ContactRequest){
        val content = contentCreatorRepository.findById(contact.contentCreatorId).orElseThrow {
            (ResourceNotFoundException(
                "Content Creator",
                contact.contentCreatorId
            ))
        }
        contactRepository.save(contact.to(content))

    }
}