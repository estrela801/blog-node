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