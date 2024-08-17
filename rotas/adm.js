const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.render('pages/adm')
})

router.get('/posts',(req,res)=>{
   res.send('pagina de posts')
    
})

router.get('/categorias',  (req,res)=>{
    res.send('pagia de categoras')
})
router.get('/blog',(req,res)=>{
    res.render('pages/blog')
})

module.exports = router