require("dotenv").config();

const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

// simulamos una base de datos
const users = require('./data/users.json');

// middleware de autenticacion
const { privateRoute } = require('./middlewares/privateRoute')

app.post('/users', (req, res) => {
  const { email, password } = req.body;


  const bcrypt = require('bcrypt');
  const saltRounds = 10;
  const myPlaintextPassword = password;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(myPlaintextPassword, salt);

  // Simulamos un INSERT en la base de datos
  // OJO: en esete ejemplo estamos simulando una base de datos con un json que cargamos en memoria
  // al iniciar el servicio.  Cuando se reinicie el servidor, se borrarán los datos insertados
  const user = {
    email,
    password: hash
  }

  users.push(user)
  res.status(201).json(user)
})

app.get('/users', (req, res, next) => {

  // Simulamos un SELECT * FROM users
  const clone = require('rfdc')()
  let u = clone(users)

  // Eliminamos el password de los usuarios para que no se exponga en la respuesta
  u = u.map(e => {
    delete e.password
    return e
  })

  res.json(u)
})

app.get('/users/privado', privateRoute, (req, res, next) => {
  res.json(users)
})

app.get('/users/:id', privateRoute, (req, res, next) => {
  // ejemplo de autorización: el usuario no puede consultarse a si mismo. ¯\_(ツ)_/¯
  if (req.USER_ID == req.params.id) return next("eres tu")

  // simulamos un SELECT * FROM users WHERE id = req.params.id
  const user = users.find(u => u.id == req.params.id)
  res.json(user)
})


app.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  const bcrypt = require("bcrypt")

  // simulamos un SELECT * FROM users WHERE email = email a la base de datos:
  const user = users.find(u => u.email === email)

  // si no existe el usuario, lanzamos un error al middleware de errores
  if (!user) return next("user not found")

  // si la contraseña no es correcta, lanzamos un error al middleware de errores
  if (!bcrypt.compareSync(password, user.password)) return next("wrong password")

  // todo ok!

  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY);  // creamos el token con el payload y la clave secreta

  res.json({ accessToken: token })
})

app.use((err, req, res, next) => {
  console.log(err)
  switch (err) {
    case "user not found":
      console.log(err)
      res.status(404).json({ error: "el usuario y el password son incorrectos" })
      break;
    case "wrong password":
      console.log(err)
      res.status(404).json({ error: "el usuario y el password son incorrectos" })
      break;

    case "401":
      console.log(err)
      res.status(401).json({ error: "realizar esta acción requiere estar autenticado (401)" })
      break;

    case "eres tu":
      res.status(403).json({ error: "no estas autorizado (403) a hacer esta acción porque eres tu" })
      break;

    default:
      res.status(500).json({ error: err })
      break;
  }
})

app.listen(port, () => {
  console.log("http://localhost:3000/users")
  console.log("http://localhost:3000/users/privado")
  console.log("http://localhost:3000/users/3")
})

