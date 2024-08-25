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
        res.render('admin/editcategorias',{categoria:categoria})
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

//Rotas das postagens -------------------------------------------------------------------------------------------
router.get('/postagens', (req,res) => {
    Postagem.find().sort({date:'desc'}).populate('categoria').lean().then( (postagens) => {
        res.render('admin/postagens',{postagens:postagens})//recuoperando postagens e na view verificando se há alguma
              
    }).catch( (err) => {
        console.log('erro ao renderizar as postagens',err);
        
    })
})
router.get('/postagens/add', (req,res) => {
    
    Categoria.find().sort({date:'desc'}).lean().then( (categorias) => { //Trazendo dados das categorias para exibir no select
        res.render("admin/addpostagens",{categorias:categorias}) 
              
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
            categoria : req.body.categoria //corrigindo erro 
        }

        new Postagem(novaPostagem).save()
    .then(() => {
        console.log('Postagem cadastrada');
        res.redirect('../postagens');
    })
    .catch((err) => {
        console.log('Erro ao cadastrar nova postagem', err);
        res.render('admin/addpostagens', { erros: [{ texto: 'Erro ao salvar a postagem' }] });
    });

    }

    
})
router.get('/postagens/edit/:id',(req,res)=>{
        Postagem.findOne({_id:req.params.id}).lean().then( (postagens) => {
            res.render('admin/editpostagens',{postagens:postagens})
        }).catch( (err) => {
            console.log('Erro ao buscar Postagem ->',err);
            
        })
})
router.post('/postagens/edit',(req,res)=>{
    
    
    Postagem.findOne({_id: req.body.id}).then( (postagem) => {
        postagem.titulo = req.body.titulo
        postagem.detalhes = req.body.detalhes
        postagem.conteudo = req.body.conteudo
    
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