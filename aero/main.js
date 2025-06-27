const express = require('express')  //import Express
const session = require("express-session");//import para manejar sesiones de usuario, autenticación, carritos de compras, etc.

const app = express()   //import express
const port = 3060;  // escucha de solicitudes
const options = { maxAge: '2h', etag: false };  //
app.use(express.static('public', options)); 
app.use(session({ secret: "1111", resave: false, saveUninitialized: false, })); //cookies y guardado de sesion
const {htmls, fecha} = require("./config/db");    //carpeta config con mariaDb
const { Aerolineas, Vuelos, Aeropuerto } = require('./models/jsMetodosParaDB');