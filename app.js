const express = require('express');
const { create } = require('express-handlebars');
const path = require('path');
const app = express();
const admin = require('./router/adm');
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const Postagem = require('./models/Postagem');
const Categoria = require('./models/Categoria');
const usuarios = require('./router/usuarios')

// Configurações
app.use(session({
    secret: 'estreladev',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use( (req,res,next) => {
    console.log('-');  
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
app.use('/usuarios', usuarios)
app.get('/', (req, res) => { 
    Postagem.find().lean().populate('categoria').then( (postagens) => {
        res.render('index',{postagens:postagens});
        
    }).catch( (err) => {
        res.redirect('/404')
        
    })
});
app.get('/404',(req,res)=>{
    res.send('404')
})

app.get('/postagem/:slug',(req,res)=>{
    
    Postagem.findOne({slug: req.params.slug}).lean().then( (postagens) => {
        console.log(postagens);
        
        if(postagens){
            res.render('postagens/index',{postagens:postagens})
        }else{
            req.flash("msg_erro", "Essa postagem não existe")
        }
        
    }).catch( (err) => {
        req.flash('msg_erro', 'Erro interno')
        res.redirect('/')
        console.log('teste');
        
    })
})


app.get('/categorias',(req,res)=>{
    Categoria.find().lean().then( (categorias) => {
        res.render("categorias/index",{categorias:categorias})

    }).catch( (err) => {
        console.log('Erro ao listar categorias ->', err);
        
    })
})

app.get('/categorias/:slug',(req,res)=>{
    Categoria.findOne({slug:req.params.slug}).lean().then( (categoria) => {
        if(categoria){
            Postagem.find({categoria:categoria._id}).lean().then( (postagens) => {
                res.render('categorias/postagens',{postagens:postagens, categoria:categoria})
            }).catch()
        }
        
    }).catch()
})
app.get('/blog', (req, res) => {
   
    res.render('admin/blog'); // Certifique-se de que 'pages/blog.handlebars' existe
});

// Outros
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log('Servidor rodando na porta ->', PORTA);
});
