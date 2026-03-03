package com.gabriel.goal_like.web.controller

import com.gabriel.goal_like.database.ContactRepository
import com.gabriel.goal_like.database.ContentCreatorRepository
import com.gabriel.goal_like.database.GoalRepository
import com.gabriel.goal_like.error.ResourceNotFoundException
//import com.gabriel.goal_like.web.dto.ContactResponse
//import com.gabriel.goal_like.web.dto.ContentCreatorModelAssembler
import com.gabriel.goal_like.web.dto.ContentCreatorRequest
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.data.rest.webmvc.RepositoryRestController
import org.springframework.http.HttpStatus
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
//import com.gabriel.goal_like.web.dto.ContentCreatorResponse
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController



@RestController
@Tag(name = "Content Creator")
class TesteContentCreatorController(
    private val repository: ContentCreatorRepository,
    private val contactRepository: ContactRepository,
    private val goalRepository: GoalRepository,

) {

    @GetMapping("api/v1/content-creator/me")
    fun get(auth: Authentication): String {
        return repository.findByAuthId(auth.name)?.id.toString() 
    }
}

//@RestController
//@RequestMapping("content-creator")
@Tag(name = "Content Creator")
@RepositoryRestController
class ContentCreatorController(
    private val repository: ContentCreatorRepository,
    private val contactRepository: ContactRepository,
    private val goalRepository: GoalRepository,
) {

    @PostMapping("content-creator")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun add(@RequestBody contentCreator: ContentCreatorRequest) {
        repository.save(contentCreator.to())
    }

//    @GetMapping
//    @RequestMapping("/{id}")
//    fun getCreator(@PathVariable id: UUID): EntityModel<ContentCreatorResponse> {
//        val creator = repository
//            .findById(id)
//            .orElseThrow { ResourceNotFoundException("Content Creator", id) }
//
////        return ResponseEntity.status(HttpStatus.FOUND).body(contentCreatorOp)
//        return assembler.toModel(creator)
//    }
//
//
//    @GetMapping
//    fun get(
//        @ParameterObject pageable: Pageable,
//        pagedAssembler: PagedResourcesAssembler<ContentCreator>
//    ): PagedModel<EntityModel<ContentCreatorResponse>> {
//        val page = repository.findAll(pageable)
//
//        return pagedAssembler.toModel(page, assembler)
//    }
//
//    @GetMapping("/{id}/contacts")
//    fun getContacts(@PathVariable id: UUID): ResponseEntity<List<ContactResponse>> {
//        val result = contactRepository.findByContentCreatorId(id).map { ContactResponse(it) }
//        return ResponseEntity.ok(result)
//    }
//
//    @GetMapping
//    @RequestMapping("/{contentCreatorId}/goals")
//    fun getGoals(@PathVariable contentCreatorId: UUID): ResponseEntity<List<Goal>> {
//        val result = goalRepository.findByContentCreatorId(contentCreatorId)
//        return ResponseEntity.ok(result)
//    }
}