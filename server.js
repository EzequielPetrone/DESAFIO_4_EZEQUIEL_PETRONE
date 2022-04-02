//Importo clase Contenedor
const Contenedor = require('./class/class_Contenedor')

//Importo express y creo server app
const express = require("express");
const app = express();

//Defino puerto y pongo a escuchar
const PUERTO = process.env.PORT || 8080
const server = app.listen(PUERTO, () => {
    console.log('Servidor HTTP escuchando en puerto:', server.address().port);
})

//Error handling
server.on("error", error => {
    console.log('Error en el servidor:', error);
})

//creo Contenedor
const contenedorProd = new Contenedor('./datos/productos.txt')

//Seteo los diferentes ENDPOINTS:

app.get("/", (req, res) => {
    console.log(req.baseUrl);
    res.send(`<h1 style="color:5a1616">Bienvenidos al 3er Desafio Entregable!</h1>
        <h3 style="color:00797f">By Ezequiel Petrone</h3>`)
})

app.get("/productos", async (req, res) => {
    try {
        res.json(await contenedorProd.getAll())
        
    } catch (error) {
        res.send(error)
    }
})

app.get("/productoRandom", async (req, res) => {
    try {
        const prodList = await contenedorProd.getAll()
        let nroRandom = Math.round(Math.random() * (prodList.length - 1))
        res.json(prodList[nroRandom])

    } catch (error) {
        res.send(error)
    }
})

app.get("/producto/:id", async (req, res) => {
    try {
        const prod = await contenedorProd.getById(req.params.id)
        res.send(prod || `No existe producto con id ${req.params.id}`)

    } catch (error) {
        res.send(error)
    }
})

