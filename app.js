const express = require('express');
const { create } = require('express-handlebars');
const path = require('path');
const app = express();
const admin = require('./rotas/adm');

// Configurações
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HandleBars
const handlebars = create({ 
    defaultLayout: 'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
// app.set('views', path.join(__dirname, 'views', 'layout'));

// Public
// app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/admin', admin);
app.get('/', (req, res) => {
    res.send('inicial');
});
app.get('/blog', (req, res) => {
    res.render('pages/blog'); // Certifique-se de que 'pages/blog.handlebars' existe
});

// Outros
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log('Servidor rodando na porta ->', PORTA);
});
