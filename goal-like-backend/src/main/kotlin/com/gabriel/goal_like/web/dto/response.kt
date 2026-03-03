package com.gabriel.goal_like.web.dto

import com.gabriel.goal_like.database.Contact
import com.gabriel.goal_like.database.ContentCreator
import com.gabriel.goal_like.notification.ChannelType
import java.util.UUID

//data class ContentCreatorResponse(
//    val id: UUID,
//    val fullName: String
//){
//    constructor(contentCreator: ContentCreator) : this(
//        id = contentCreator.id ,
//        fullName = contentCreator.fullName
//    )
//}
//
//data class ContactResponse(
//    val id: Long,
//    val contact: String,
//    val type: ChannelType,
//) {
//    constructor(contact: Contact) : this(
//        id = contact.id,
//        contact = contact.contact,
//        type = contact.type
//    )
//}
data class LoginResponse(
    val id: UUID
)