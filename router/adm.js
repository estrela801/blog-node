const express = require('express')
const router = express.Router()
const Categoria = require('../models/Categoria')
const Postagem = require("../models/Postagem")
const {eAdmin} = require('../helpers/eAdmin')


router.get('/', eAdmin,(req,res)=>{
    res.render('admin/adm')
})

router.get('/posts',eAdmin,(req,res)=>{
   res.send('pagina de posts')
    
})

router.get('/categorias',eAdmin,  (req,res)=>{
    Categoria.find().lean().sort({date:'desc'}).then( (categorias) => {
        res.render('admin/categorias',{categorias: categorias})
        
    }).catch( (err) => {
        console.log('Deu ruim pra listar',err);
              
    })
})
router.get('/categorias/add',(req,res)=>{
    res.render('admin/addcategoria')
})
router.get('/categorias/edit/:id',eAdmin,(req,res) => {
    Categoria.findOne({_id: req.params.id}).lean().then( (categoria) => {
        res.render('admin/editcategorias',{categoria:categoria})
    }).catch( (err) => {
        req.flash('msg_erro','categoria não encontrada ->')
    })
})


router.post('/categorias/edit',eAdmin, (req,res) => {
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



router.post('/categorias/delete',eAdmin, (req,res) => {
    Categoria.deleteOne({_id:req.body.id}).then( () => {
        console.log('Categoria deleteda')
        res.redirect('/admin/categorias')
        
    }).catch( (err) => {
        console.log('a categoria não foi deletada',err);
        
    })
})

router.get('/blog',eAdmin,(req,res)=>{
    res.render('admin/blog')
})
router.post('/categorias/add/', eAdmin, (req,res) => {
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

//Rotas das postagens -------------------------------------------------------------------------------------------






router.get('/postagens/edit/:id',eAdmin,(req,res)=>{
        Postagem.findOne({_id:req.params.id}).lean().then( (postagens) => {
            res.render('admin/editpostagens',{postagens:postagens})
        }).catch( (err) => {
            console.log('Erro ao buscar Postagem ->',err);
            
        })
})
router.post('/postagens/edit',eAdmin,(req,res)=>{
    
    
    Postagem.findOne({_id: req.body.id}).then( (postagem) => {
        postagem.titulo = req.body.titulo
        postagem.detalhes = req.body.detalhes
        postagem.conteudo = req.body.conteudo
        postagem.slug = req.body.slug
    
            postagem.save().then( () => {
                console.log('Postagem editada com sucesso');
                res.redirect('/admin/postagens')
                
            }).catch( (err) => {
                console.log('Erro ao editar Postagem ->',err);
                      
            })
    }).catch( (err) => {
        console.log('erro ao buscar postagem ->', err);
        
    })
})

router.post('/postagens/delete', (req,res) => {
    Postagem.deleteOne({_id:req.body.id}).then( () => {
        console.log('postagens deleteda')
        res.redirect('/admin/postagens')
        
    }).catch( (err) => {
        console.log('a categoria não foi deletada',err);
        
    })
})

module.exports = router