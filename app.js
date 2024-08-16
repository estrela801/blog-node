// iniciando Módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    //const mongoose = require('mongoose')
//Configurações
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    // HandleBars
        app.engine('handlebars', handlebars({defaultLayout:'main'}))
        app.set('view engine', 'handlebars')
    //Mongoose
        //Em breve
//Rotas

//Outros
const PORTA = 3000
app.listen(PORTA, ()=>{
    console.log('Servidor rodando na porta ->', PORTA);
    
})