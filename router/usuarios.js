const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Usuario = require('../models/Usuarios')
const bcrypt = require('bcryptjs')
const Usuarios = require('../models/Usuarios')
const passport = require('passport')
const Postagem = require('../models/Postagem')
const Categoria = require('../models/Categoria')



router.get('/cadastro', (req,res) => {
    res.render('usuarios/cadastro')
})
router.post('/cadastro', (req, res) => {
    const erros = [];

    if (!req.body.nome || typeof req.body.nome === 'undefined' || typeof req.body.nome === 'null' || req.body.nome.length < 3) {
        erros.push({ texto: 'Nome inválido. Deve ter pelo menos 3 caracteres.' });
    }

    if (!req.body.email || typeof req.body.email === 'undefined' || typeof req.body.email === 'null' || req.body.email.length < 3) {
        erros.push({ texto: 'Email inválido.' });
    }

    if (!req.body.senha || typeof req.body.senha === 'undefined' || typeof req.body.senha === 'null' || req.body.senha.length < 3) {
        erros.push({ texto: 'Senha inválida. Deve ter pelo menos 3 caracteres.' });
    }

    if (req.body.senha !== req.body.senha2) {
        erros.push({ texto: 'As senhas são diferentes.' });
    }

    if (erros.length > 0) {
        res.render('usuarios/cadastro', { erros: erros });
    } else {
        Usuarios.findOne({email: req.body.email}).lean().then( (usuario) => {
            if(usuario){
                req.flash('msg_erro', 'Já existe um usuário com esse email em nosso sistema')
                res.redirect('/usuarios/cadastro')
            }else{
                const novoUsuario = new Usuario({
                    nome : req.body.nome,
                    email : req.body.email,
                    senha : req.body.senha
                })

                bcrypt.genSalt(10,(erro,salt)=>{
                    bcrypt.hash(novoUsuario.senha, salt, (erro,hash)=>{

                        if(erro)req.flash('msg_erro', 'Houve um problema ao salvar o usuário')
                        
                        novoUsuario.senha = hash

                        novoUsuario.save().then( () => {
                            req.flash('msg_sucesso', 'Usuário criado com sucesso')
                            res.redirect('/')
                        }).catch(err=>{
                            req.flash('msg_erro', 'Houve um problema ao criar o usuário. Tente novamente')
                            res.redirect('/usuarios/cadastro')
                        })
                    })
                })
            }     
        }).catch( (err) => {
            req.flash('msg_erro', 'Houve um erro interno')
        })
    }
});
 

router.get('/login',(req,res)=>{
    res.render('usuarios/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req, res, next);
});



router.get('/logout', (req,res)=>{
    req.logout(()=>{
        req.flash('msg_sucesso', 'Deslogado :)')
        res.redirect('/')
    })
    
})

router.get('/postagens', (req,res) => {
    Postagem.find().sort({date:'desc'}).populate('categoria').lean().then( (postagens) => {
        res.render('postagens',{postagens:postagens})//recuoperando postagens e na view verificando se há alguma
              
    }).catch( (err) => {
        console.log('erro ao renderizar as postagens',err);
        
    })
})
router.get('/postagens/add', (req,res) => {
    
    Categoria.find().sort({data:'desc'}).lean().then( (categorias) => { //Trazendo dados das categorias para exibir no select
        res.render("postagens/addpostagens",{categorias:categorias}) 
              
    }).catch(err=>{
    console.log('erro para achar as categorias',err)
})
})

router.post('/postagens/add',(req,res)=>{
    
    const erros = []

    if(!req.body.titulo||typeof req.body.titulo == undefined|| typeof req.body.titulo == null || req.body.titulo.lenght<3){
        erros.push({texto: 'Nome ruim'})
    }
    if(!req.body.detalhes||typeof req.body.detalhes == undefined|| typeof req.body.detalhes == null || req.body.detalhes.lenght < 3 ){
        erros.push({texto: 'detalhe ruim'})
    }
    if(!req.body.conteudo||typeof req.body.conteudo == undefined|| typeof req.body.conteudo == null || req.body.conteudo.lenght<3){
        erros.push({texto: 'conteudo ruim'})
    }
    if(!req.body.slug||typeof req.body.slug == undefined|| typeof req.body.slug == null || req.body.slug.lenght<3){
        erros.push({texto: 'slug ruim'})
    }
    if(req.body.categoria == '0'){ //verificando se a postagem está sendo registrada em alguma categoria
        erros.push({texto: 'categoria invalida'})//caso sim, adicione o texto no array
    }
    if(erros.length>0){
        res.render('admin/addpostagens',{erros:erros})//se houver erro, renderizar para o usuario
    }else{
        
        const novaPostagem ={ //cadastrando nova postagem 
            titulo : req.body.titulo, //recuperando dados com o body-parser
            detalhes : req.body.detalhes,
            conteudo : req.body.conteudo,
            categoria : req.body.categoria, //corrigindo erro 
            slug : req.body.slug
        }

        new Postagem(novaPostagem).save()
    .then(() => {
        console.log('Postagem cadastrada');
        res.redirect('/');
    })
    .catch((err) => {
        console.log('Erro ao cadastrar nova postagem', err);
        res.render('admin/addpostagens', { erros: [{ texto: 'Erro ao salvar a postagem' }] });
    });

    }

    
})


module.exports = router