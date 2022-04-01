require("dotenv").config(); 

const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

const users = [
  {
    "email": "alice@acme.com",
    "password": "$2b$10$GjELP1IhErZc0WSw3lSGh.RpUZEsictX.haV1Uq8qvdUQM45.pUnS"
  },
  {
    "email": "bob@acme.com",
    "password": "$2b$10$uEVk9HlBCoWiKrLGH44uCu9C2..9fVRuQgWWBvecQ9dwDKl/mH30q"
  },
  {
    "email": "charlie@acme.com",
    "password": "$2b$10$sS3QgN7AemghpGgj2O77oO2kDW2RmmrJTg5MfPIAarlTm6z7eFNRy"
  },
  {
    "email": "dave@acme.com",
    "password": "$2b$10$tXqoFLGkUzIf7qC/6YyaI.D.ZyNhTLpntpLfKTjyzey/YQKtSvcf6"
  },
  {
    "email": "eva@acme.com",
    "password": "$2b$10$Gev2/i855/3/PnXeOCH9yu2fn.iJhtlN.httXpwsagGcVKtFQP8rW"
  }
];

app.post('/users', (req, res) => {
  const { email , password } = req.body;


  const bcrypt = require('bcrypt');
  const saltRounds = 10;
  const myPlaintextPassword = password;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(myPlaintextPassword, salt);

  // insert
  const user = {
    email,
    password: hash
  }

  users.push(user)
  res.status(201).json(user)
})

app.get('/users' ,(req,res) => {
  
  const clone = require('rfdc')()
  
  let u = clone(users)
  console.log(u)
  
  u = u.map(e => {
    delete e.password
    return e
  })
  
  console.log(users)
  res.json(u)
} )

app.get('/users/privado' ,(req,res) => {
  res.json(users)
} )

app.post('/login' , (req, res, next) => {
  const { email , password } = req.body;

  const bcrypt = require("bcrypt")

  // SELECT * FROM users WHERE email = email;
  const user = users.find( u => u.email === email )
  if (!user) return next("user not found")

  if (!bcrypt.compareSync(password, user.password)) return next("wrong password");

  // todo ok!
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ user: user.email , password: user.password }, process.env.JWT_KEY);

  res.json({accessToken: token})
})

app.use((err, req, res, next) => {
  switch (err) {
    case "user not found":
      console.log(err)
      res.status(404).json({ error: "el usuario y el password son incorrectos" })
      break;
    case "wrong password":
      console.log(err)
      res.status(404).json({ error: "el usuario y el password son incorrectos" })
      break;
    default:
      res.status(500).json({ error: err })
      break;
  }
})

app.listen(port , () => {
  console.log("http://localhost:3000/users")
})

