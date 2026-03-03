package com.gabriel.goal_like.web.dto

import com.gabriel.goal_like.database.Contact
import com.gabriel.goal_like.database.ContentCreator
//import com.gabriel.goal_like.web.controller.ContentCreatorController
//import com.gabriel.goal_like.web.controller.GoalController
import org.springframework.hateoas.EntityModel
import org.springframework.hateoas.server.RepresentationModelAssembler
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn
import org.springframework.stereotype.Component
import kotlin.jvm.java

//@Component
//class ContentCreatorModelAssembler :
//    RepresentationModelAssembler<ContentCreator, EntityModel<ContentCreatorResponse>> {
//
//    override fun toModel(entity: ContentCreator): EntityModel<ContentCreatorResponse> {
//
//        val response = ContentCreatorResponse(entity)
//
//        return EntityModel.of(
//            response,
//            linkTo(methodOn(ContentCreatorController::class.java).getContacts(entity.id)).withRel("contacts"),
//            linkTo(methodOn(ContentCreatorController::class.java).getGoals(entity.id)).withRel("goals")
//        )
//    }
//}
