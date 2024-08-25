const express = require('express')
const router = express.Router()
const Categoria = require('../models/Categoria')
const Postagem = require("../models/Postagem")


router.get('/',(req,res)=>{
    res.render('admin/adm')
})

router.get('/posts',(req,res)=>{
   res.send('pagina de posts')
    
})
router.get('/categorias/add',(req,res)=>{
    res.render('admin/addcategoria')
})
router.get('/categorias',  (req,res)=>{
    Categoria.find().lean().sort({date:'desc'}).then( (categorias) => {
        res.render('admin/categorias',{categorias: categorias})
        
    }).catch( (err) => {
        console.log('Deu ruim pra listar',err);
              
    })
})
router.get('/categorias/edit/:id', (req,res) => {
    Categoria.findOne({_id: req.params.id}).lean().then( (categoria) => {
        res.render('admin/edit',{categoria:categoria})
    }).catch( (err) => {
        req.flash('msg_erro','categoria não encontrada ->')
    })
})
router.post('/categorias/edit', (req,res) => {
    Categoria.findOne({_id: req.body.id}).then( (categoria) => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug
        
        categoria.save().then( () => {
            req.flash('msg_sucesso', 'Categoria editada com sucesso')
            res.redirect('/admin/categorias')
        }).catch( (err) => {
            console.log('erro ao salvar a edição');

            
            res.redirect('/admin/categorias')
        })
              
    }).catch( (err) => {
        console.log('Erro ao encontrar usuario', err );
        
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/delete', (req,res) => {
    Categoria.deleteOne({_id:req.body.id}).then( () => {
        console.log('Categoria deleteda')
        res.redirect('/admin/categorias')
        
    }).catch( (err) => {
        console.log('a categoria não foi deletada',err);
        
    })
})

router.get('/blog',(req,res)=>{
    res.render('admin/blog')
})
router.post('/categorias/add/',  (req,res) => {
    let erros = []

    if(!req.body.nome||typeof req.body.nome == undefined|| typeof req.body.nome == null){
        erros.push({texto: 'Nome ruim'})
    }
    if(!req.body.slug||typeof req.body.slug == undefined|| typeof req.body.slug == null){
        erros.push({texto: 'slug ruim'})
    }

    if(erros.length > 0){
        res.render('admin/addcategoria',{erro: erros})
    }else{
        const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then( () => {
        res.redirect("../categorias")
        }).catch(err=>{
            console.log('Erro ao registrar nova categoria ->', err);
        })
    }
    
})

//Rotas das postagens

router.get('/postagens/add', (req,res) => {
    
    Categoria.find().lean().then( (categorias) => {
        res.render("admin/addpostagens",{categorias:categorias}) 
              
    }).catch(err=>{
    console.log('erro para achar as categorias',err)
})
})

router.get('/postagens', (req,res) => {
    res.render('admin/postagens')
})

router.post('/postagens/add',(req,res)=>{
    const erros = []
    const valorSelect = req.body.categoria
    if(valorSelect == '0'){
        erros = {texto: 'categoria invalida'}
    }
    if(erros.length>0){
        res.render('/admin/addpostagens',{erros:erros})
    }else{
        
        const novaPostagem ={
            titulo : req.body.titulo,
            detalhes : req.body.detalhes,
            conteudo : req.body.conteudo,
            categoria : req.body.titulo
        }

        new Postagem(novaPostagem).save().then( () => {
                  
        }).catch( (erro) => {
                  
        })
    }

    
})

module.exports = router