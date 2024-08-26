const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Usuario = require('../models/Usuarios')



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
        console.log('Tudo certo, usuário pode ser cadastrado');
    }
});
 


module.exports = router