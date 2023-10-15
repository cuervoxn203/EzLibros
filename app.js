const express = require('express')
const app = express()
const dotenv = require('dotenv')
const bcryptjs = require('bcryptjs') //Para encriptar contraseñas
const session = require('express-session') //Para los inicios de sesion

dotenv.config({path: './env/.env'})
const client = require('./server/conexion') // Importa la conexión de la base de datos

const {getProductDetails, getFeaturedBooks} = require('./product')

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

app.get('/', async (req, res) => {
    try {
        let featuredBooks = await getFeaturedBooks()
        if (req.session.loggedin) {
            res.render('index', { login: true, name: req.session.name, featuredBooks })
        } else {
            res.render('index', { login: false, featuredBooks })
        }
    } catch (error) {
        console.error('Error al obtener libros más vendidos:', error)
        res.status(500).send('Error interno del servidor')
    }
})

app.get('/logout',(req,res) =>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
})

app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/product/:productID', async (req, res) => {
    const productID = req.params.productID;
    const productDetails = await getProductDetails(productID);

    if (productDetails) {
        // Verificar si se obtuvieron detalles del producto
        res.render('product', { product: productDetails });
    } else {
        // Producto no encontrado
        res.status(404).render('product-not-found', { productID });
    }
});

app.post('/register', async(req,res)=>
{
    //async para encriptar/desencriptar contraseñas
    const { name, last_name, email, tel, pass } = req.body;
    console.log(req.body)
    let passwordHash = await bcryptjs.hash(pass,8) //determinar hash de la contraseña
    client.query( 'INSERT INTO cliente (cliente_nombre, cliente_apellido, correo_electronico, contrasenia, telefono) VALUES ($1, $2, $3, $4, $5)', [name, last_name, email, passwordHash, tel],(error,result) =>{
        if (error){
            console.log(error)
        }else{
            res.send('Usuario registrado correctamente')
        }
    })
})

app.post('/auth',async (req,res)=>{
    const {user,pass} = req.body
    if(user && pass){
        client.query('SELECT * FROM cliente WHERE correo_electronico = $1', [user], async (error, results) => {
            //console.log(results)
            if (error) {
                console.error("Error en la consulta SQL:", error)
            } else {
                if (results.rows.length === 0 || !(await bcryptjs.compare(pass,results.rows[0].contrasenia)) ) {
                    res.send("Usuario o contraseña incorrectos")
                } else {
                    req.session.name = results.rows[0].cliente_nombre
                    req.session.loggedin = true
                    res.send("Usuario aceptado")
                    }
                }
            })
        }
    })

app.listen(3000, () => {
    console.log('Servidor en funcionamiento en el puerto 3000')
})
