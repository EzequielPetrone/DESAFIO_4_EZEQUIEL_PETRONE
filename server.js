try {
    //Importo clase Contenedor e instancio uno
    const Contenedor = require('./class/class_Contenedor')
    const contenedorProd = new Contenedor('./datos/productos.txt')

    //Importo express, creo server app y configuro Router
    const express = require("express");
    const { Router } = express
    const app = express();
    const router = Router()
    app.use('/api/productos', router)

    //Seteo Static
    app.use('/static', express.static(__dirname + '/public'));

    //Configuro Middleware de manejo de errores
    const mwError = (err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: err });
    }
    app.use(mwError)
    router.use(mwError)

    //Seteo los diferentes ENDPOINTS:

    //Configuro para poder leer sin problemas los req.body
    router.use(express.json())
    router.use(express.urlencoded({ extended: true }))

    //Lanzo index.html
    app.get("/", (req, res) => {
        try {
            res.sendFile(__dirname + '/public/index.html')

        } catch (error) {
            res.status(500).json({ error: error });
        }
    })

    //GET '/api/productos' -> devuelve todos los productos.
    router.get("/", async (req, res) => {
        try {
            res.json(await contenedorProd.getAll())

        } catch (error) {
            res.status(500).json({ error: error });
        }
    })

    //GET '/api/productos/:id' -> devuelve un producto según su id.
    router.get("/:id", async (req, res) => {
        try {
            const prod = await contenedorProd.getById(req.params.id)
            if (prod) {
                res.json(prod)
            } else {
                throw `Producto con id ${req.params.id} NO encontrado`
            }
        } catch (error) {
            res.status(500).json({ error: error });
        }
    })

    //POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
    router.post("/", async (req, res) => {
        try {
            let newId = await contenedorProd.save(req.body)

            if (newId) {
                res.json(await contenedorProd.getById(newId))
            } else {
                throw 'No se pudo crear el producto'
            }
        } catch (error) {
            res.status(500).json({ error: error });
        }
    })

    //PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
    router.put("/:id", async (req, res) => {
        try {
            if (await contenedorProd.editById(req.params.id, req.body)) {
                res.json(await contenedorProd.getById(req.params.id))
            } else {
                throw `No se pudo editar objeto con id ${req.params.id}`
            }
        } catch (error) {
            res.status(500).json({ error: error });
        }
    })

    //DELETE '/api/productos/:id' -> elimina un producto según su id.
    router.delete("/:id", async (req, res) => {
        try {
            if (await contenedorProd.deleteById(req.params.id)) {
                res.json({ ok: `Eliminado del file objeto con id ${req.params.id}` })
            } else {
                throw `No hay objeto con id ${req.params.id} para eliminar. Contenido del file sigue igual`
            }
        } catch (error) {
            res.status(500).json({ error: error });
        }
    })

    //Defino puerto y pongo server a escuchar
    const PUERTO = 8080
    const server = app.listen(PUERTO, () => {
        console.log('Servidor HTTP escuchando en puerto:', server.address().port);
    })

    //Server Error handling
    server.on("error", error => {
        console.log('Error en el servidor:', error);
    })

} catch (error) {
    console.log('Error en el hilo principal:', error);
}


