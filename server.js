try {
    //Importo clase Contenedor e instancio uno
    const Contenedor = require('./class/class_Contenedor')
    const contenedorProd = new Contenedor('./datos/productos.txt')

    //Importo express, creo server app y configuro Router
    const express = require("express");
    const { Router } = express
    const app = express();
    const router = Router()
    app.use('/miapi', router)

    //Seteo Static
    app.use('/static', express.static(__dirname + '/public'));

    //Configuro para poder leer sin problemas los req.body
    router.use(express.json())
    router.use(express.urlencoded({ extended: true }))

    //Seteo los diferentes ENDPOINTS:

    app.get("/", (req, res) => {
        res.sendFile(__dirname + '/public/index.html')
    })

    router.get("/productos", async (req, res) => {
        try {
            res.json(await contenedorProd.getAll())

        } catch (error) {
            res.send(error)
        }
    })

    router.get("/productoRandom", async (req, res) => {
        try {
            const prodList = await contenedorProd.getAll()
            let nroRandom = Math.round(Math.random() * (prodList.length - 1))
            res.json(prodList[nroRandom])

        } catch (error) {
            res.send(error)
        }
    })

    router.get("/producto/:id", async (req, res) => {
        try {
            const prod = await contenedorProd.getById(req.params.id)
            res.send(prod || `No existe producto con id ${req.params.id}`)

        } catch (error) {
            res.send(error)
        }
    })

    router.post("/producto", async (req, res) => {
        try {
            let p
            console.log(req.body);
            if (Array.isArray(req.body)) {
                p = req.body[0]
            } else {
                p = req.body
            }
            let newId = await contenedorProd.save(p)
            if (newId) {
                res.send(`test post producto! nuevo id: ${newId}`)
            } else {
                res.send('No se pudo crear el producto. Objeto no valido')
            }

        } catch (error) {
            res.send(error)
        }
    })

    //Defino puerto y pongo server a escuchar
    const PUERTO = process.env.PORT || 8080
    const server = app.listen(PUERTO, () => {
        console.log('Servidor HTTP escuchando en puerto:', server.address().port);
    })

    //Error handling
    server.on("error", error => {
        console.log('Error en el servidor:', error);
    })

} catch (error) {
    console.log('Error en el hilo principal:', error);
}


