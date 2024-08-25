const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Postagem = new Schema({
    titulo:{
        type: String,
        required: true
    },
    detalhes:{
        type: String,
        required:true
    },
    categoria: {
        type:Schema.Types.ObjectId, // referencia um outro model/collection/tabela
        ref: 'categorias',// qual collection : categorias
        required:true
    },
    conteudo:{
        type:String,
        required:true
    },
    data:{
        type: Date,
        default: Date.now()
    }

})




// Postagem.save().then( () => {
//     console.log('Modelo salvo');
    
// }).catch( (err) => {
//     console.log('modelo não salvo',err);
    
// })


module.exports = mongoose.model('postagem',Postagem)