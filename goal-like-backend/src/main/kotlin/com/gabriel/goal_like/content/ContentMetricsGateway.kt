package com.gabriel.goal_like.content

/*
    TODO melhorar comunicação e responsabilidade.
    Talvez: a interface precisa saber da onde pegar(link) e o que pegar(like,comment,vizualização,...)
    Talvez: ela precise/seja uma strategy pra escolher a fonte dos dados(api youtube, rede social,...)
 */
interface ContentMetricsGateway {

    fun get(link: String)
}