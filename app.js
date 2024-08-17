// iniciando Módulos
    const express = require('express')
    const { create } = require('express-handlebars')
    const handlebars = create({defaultLayout:'main'})
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require('./rotas/adm')
    const path = require('path')
    //const mongoose = require('mongoose')
//Configurações
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    // HandleBars
        app.engine('handlebars', handlebars.engine)
        app.set('view engine', 'handlebars')
    //Mongoose
        //Em breve
    // Public
        app.use(express.static(path.join(__dirname,'public')))
//Rotas
    app.use('/admin', admin)
//Outros
const PORTA = 3000
app.listen(PORTA, ()=>{
    console.log('Servidor rodando na porta ->', PORTA);
    
})