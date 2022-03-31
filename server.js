const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const exphbs =require("express-handlebars");
const path = require("path");


const connectMongo = require('connect-mongo');
const MongoStore = connectMongo.create({
    mongoUrl: 'mongodb+srv://user_node:user_node@cluster0.ivd3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    ttl: 60
})

const app = express();

app.use(cookieParser());
app.use(session({
    store: MongoStore,
    secret: '123456789!@#$%^&*()',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 100000 
    }
}));

/*----------- Motor de plantillas -----------*/
app.set('views', path.join(path.dirname(''), './src/views') )
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())


/*============================[Rutas]============================*/
app.get('/', (req, res)=>{
    if (req.session.nombre) {
        res.redirect('/datos')
    } else {
        res.redirect('/login')
    }
})

app.get('/login', (req, res)=>{
    res.render('login');
})

app.post('/login', (req, res)=>{
    const {nombre, password} = req.body;
    const existeUsuario = usuariosDB.find(usuario => usuario.nombre == nombre && usuario.password == password);
    console.log(existeUsuario);
    if (!existeUsuario) {
        res.render('login-error')
    } else {
        req.session.nombre = nombre;
        req.session.contador = 0;
        res.redirect('/datos');
    }
})


app.get('/con-session', (req,res) => {
    if (req.session.contador) {
        req.session.contador++;
        res.send(`Ud ha visitado el sitio ${req.session.contador} veces`)
    } else {
        req.session.contador = 1;
        res.send('Bienvenido!');
    }
})

app.get('/logout', (req,res) => {
    req.session.destroy( err => {
        if(!err) res.send('Logout ok!')
        else res.send({status: 'Logout ERROR', body: err})
    })
})

const PORT = 8787
app.listen(PORT, () => {
    console.log(`Servidor express escuchando en el puerto ${PORT}`)
});
