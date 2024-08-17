const express = require('express')
const router = express.Router()

router.get('/',()=>{
    res.send('pagina principal')
    
})

router.get('/posts',(req,res)=>{
   res.send('pagina de posts')
    
})

router.get('/categorias',  (req,res)=>{
    res.send('pagia de categoras')
    
})
module.exports = router