const express = require('express')
const app = express()
const dotenv = require('dotenv')
const bcryptjs = require('bcryptjs') //Para encriptar contraseñas
const session = require('express-session') //Para los inicios de sesion

dotenv.config({path: './env/.env'})
const client = require('./server/conexion') // Importa la conexión de la base de datos

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use('/resources',express.static('public'))
app.use('/resources',express.static(__dirname + '/public'))
app.use(session({
    secret: 'secret', //Claves *se puede cambiar por algoritmos
    resave: true,
    saveUninitialized: true
}))

app.set('view engine','ejs')

app.get('/', (req, res) => {
    res.render('index', {msg: 'Mensaje de prueba'})
})

app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/login', (req, res) => {
    const { username, password } = req.body
    //Verificacion de credenciales
})

app.post('/register', async(req,res)=>
{
    //async para encriptar/desencriptar contraseñas
    console.log("Registro de usuario")
    //Obtener datos con req.body
    //let passwordHash = await bcryptjs.hash(pass,8) //determinar hash de la contraseña
    //Realizar sentencia SQL insert //El password se guardaria con passwordHash
})

app.post('/auth',async (req,res)=>{
    const usuario = req.body.user
    const pass = req.body.pass
    //let passwordHash = await bcryptjs.hash(pass,8)
    if(usuario && pass){
        console.log(usuario,pass)
    }else{
        console.log("Ingresa un usuario y contraseña")
    }
})

app.listen(3000, () => {
    console.log('Servidor en funcionamiento en el puerto 3000')
})
