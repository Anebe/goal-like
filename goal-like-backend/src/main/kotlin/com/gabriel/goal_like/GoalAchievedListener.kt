package com.gabriel.goal_like

import com.gabriel.goal_like.database.*
import com.gabriel.goal_like.domain.GoalEvent
import com.gabriel.goal_like.domain.GoalEventType
import com.gabriel.goal_like.domain.TargetType
import com.gabriel.goal_like.notification.ChannelType
import com.gabriel.goal_like.notification.Message
import com.gabriel.goal_like.notification.Notifier
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionalEventListener
import java.time.LocalDate
import java.util.*


@Component
class GoalAchievedListener(
    private val contentCreatorRepo: ContentCreatorRepository,
    private val goalRepository: GoalRepository,
    private val notifierFactory: NotifierFactory,
    private val contactRepository : ContactRepository,
) {

    @Async
    @TransactionalEventListener
    fun handle(event: GoalEvent) {
        val goal = goalRepository.findById(event.goalId).get()
        val notifier = notifierFactory.criar(goal.channel, goal.contentCreator)
        val creatorId = goal.contentCreator.id ?: throw IllegalStateException("Content Creator deve ter id!")
        val contact = contactRepository.findByContentCreatorIdAndType(creatorId, goal.channel)
            ?: throw IllegalStateException("Precisa haver o tipo de contato no usuário equivalento ao da meta")

        notifier.sendNotification(contact.contact, resolveMessage(event))
    }



    private fun resolveMessage(event: GoalEvent): Message {
        return when (event.type) {
            GoalEventType.GOAL_COMPLETED -> Message("","You completed your goal!")

            GoalEventType.GOAL_FAILED -> Message("","Your goal has failed.")

            GoalEventType.GOAL_PROGRESS -> Message("","Your goal reached " + event.data["progress"] + "%")

            GoalEventType.GOAL_DEADLINE_NEAR -> Message("","Your goal ends in " + event.data["days_to_end"] + " days")
        }

    }
}


@Component
class NotifierFactory(
    canais: List<Notifier>
) {

    private val canaisPorTipo = canais.associateBy { it.tipo }

    fun criar(tipo: ChannelType, usuario: ContentCreator): Notifier {

//        val contato = usuario.contacts
//            .firstOrNull { it.type == tipo }
//            ?: throw RuntimeException("Contato não encontrado")

        val channel = canaisPorTipo[tipo]
            ?: throw RuntimeException("Canal não suportado")

        //channel.destination = contato.contact
        return channel
    }
}