const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

// Configura bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// Configura mongoose
mongoose.connect('mongodb://127.0.0.1:27017/Lab8', { useNewUrlParser: true, useUnifiedTopology: true });

// Configura express-session
app.use(session({
    secret: 'tu_secreto',
    resave: true,
    saveUninitialized: true
}));

// Definir el modelo de usuario
const User = mongoose.model('User', {
    username: String,
    password: String
});

// Rutas
app.get('/', (req, res) => {
    res.redirect('/registro');
});

app.get('/registro', (req, res) => {
    res.sendFile(__dirname + '/registro.html');
});

app.post('/registro', async (req, res) => {
    const { username, password } = req.body;

    // Encripta la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        password: hashedPassword
    });

    await user.save();

    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        res.redirect('/perfil');
    } else {
        res.send('Usuario o contraseña incorrectos');
    }
});

app.get('/perfil', async (req, res) => {
    if (req.session.userId) {
        const user = await User.findById(req.session.userId);
        const usuarios = await User.find({}, 'username');

        let tablaUsuarios = '<h2>Lista de usuarios registrados en la tabla:</h2><table> <tr><th>Usuarios registrados:</th></tr>';

        usuarios.forEach(usuario => {
            tablaUsuarios += `<tr><td>${usuario.username}</td></tr>`;
        });

        tablaUsuarios += '</table>';

        const mensajeBienvenida = `<h1>Bienvenido  ${user.username}</h1>`;

        res.send(mensajeBienvenida + tablaUsuarios);
    } else {
        res.redirect('/login'); 
    }
});




app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});
