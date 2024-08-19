const express = require('express');
const { create } = require('express-handlebars');
const path = require('path');
const app = express();
const admin = require('./rotas/adm');
const mongoose = require('mongoose')

// Configurações
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use( (req,res,next) => {
    console.log('oi eu sou um middleware');
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
