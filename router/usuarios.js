const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Usuario = require('../models/Usuarios')
const bcrypt = require('bcryptjs')
const Usuarios = require('../models/Usuarios')
const passport = require('passport')



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



module.exports = router