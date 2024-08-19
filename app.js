const express = require('express');
const { create } = require('express-handlebars');
const path = require('path');
const app = express();
const admin = require('./rotas/adm');
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

// Configurações
app.use(session({
    secret: 'estreladev',
    resave: true,
    saveUninitialized: true
}))
app.use(flash)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use( (req,res,next) => {
    console.log('oi eu sou um middleware');
    next()
})
//Midleware
app.use( (req,res,next) => {
    res.locals.msg_sucesso = req.flash('msg_sucesso')
    res.locals.msg_err = req.flash('msg_erro')

    next()
})
// HandleBars
const handlebars = create({ 
    defaultLayout: 'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
// app.set('views', path.join(__dirname, 'views', 'layout'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

//Mongoose
    mongoose.connect('mongodb://localhost/blogapp').then(()=>{
        console.log('Conectado com sucesso');
    }
).catch(err=>{
    console.log('Banco não conectado',err);
    
})
mongoose.Promisse = global.Promisse
// Rotas
app.use('/admin', admin);
app.get('/', (req, res) => {
    res.send('inicial');
});
app.get('/blog', (req, res) => {
    res.render('admin/blog'); // Certifique-se de que 'pages/blog.handlebars' existe
});

// Outros
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log('Servidor rodando na porta ->', PORTA);
});
