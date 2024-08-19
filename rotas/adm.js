const express = require('express')
const router = express.Router()
const Categoria = require('../models/Categoria')


router.get('/',(req,res)=>{
    res.render('admin/adm')
})

router.get('/posts',(req,res)=>{
   res.send('pagina de posts')
    
})
router.get('/categorias/add'    ,(req,res)=>{
    res.render('admin/addcategoria')
})
router.get('/categorias',  (req,res)=>{
    res.render('admin/categorias')
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

    if(erros.lenght > 0){
        res.render('admin/addcategorias',{erro: erros})
    }



    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then( () => {
        console.log('Categoria registrada');
    }).catch(err=>{
        console.log('Erro ao registrar nova categoria ->', err);
    })
})

module.exports = router