module.exports = {
    eAdmin: function(req,res,next){
        if(req.isAuthenticated() && req.user.eAdmin ==1){
            return next()
        }
        req.flash('msg_erro', 'Você não é administrador')
        res.redirect('/')
    }
}