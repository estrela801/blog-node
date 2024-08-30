const localStrategy = require('passport-local').Strategy    
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuarios')

module.exports = (passport) => {
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {
        Usuario.findOne({email: email}).then(usuario => {
            if (!usuario) {
                console.log('Email não encontrado');
                
                return done(null, false, { message: 'O usuário não existe' });
            }

            bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                if (batem) {
                    console.log('Senha correta');
                    return done(null, usuario);
                } else {
                    console.log('Senha incorreta', erro);
                    return done(null, false, { message: 'Senha incorreta'});
                }
            });
        }).catch(err => {
            return done(err);
        });
    }));

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    });

    passport.deserializeUser(async   (id, done) => {
        try {
            const usuario = await Usuario.findById(id).lean();
            done(null, usuario);
        } catch (err) {
            done(err, null);
        }
    }); 
    
}
