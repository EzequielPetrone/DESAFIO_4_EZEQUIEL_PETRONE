// Importo de Node 'fs' para gestión del FileSystem y 'path' para tratamiento de rutas
const fs = require('fs')
const path = require('path');

class Contenedor {

    constructor(archivo) {

        this.archivo = archivo
        this.lastId = 0 // En este atributo guardo el id del último objeto del Contenedor

        // Dado que el constructor de una clase no puede ser async, 
        // utilizo los métodos sincrónicos de fs para que las validaciones y lectura del mayor id sean bloqueantes
        // En todos los métodos de la clase Contenedor uso fs.promises

        if (!fs.existsSync(archivo)) { // Valido si existe el archivo para evaluar si lo creo o no.

            const dir = path.dirname(archivo)
            if (!fs.existsSync(dir)) {
                // Valido si existe la ruta del archivo, y sino la creo!
                // sino luego me falla la creación del archivo...
                try {
                    fs.mkdirSync(dir)

                } catch (error) {
                    console.log('Error al crear carpeta:', dir);
                    throw error
                }
            }
            try {
                fs.writeFileSync(archivo, JSON.stringify([]))
                console.log(`Archivo ${archivo} creado de cero`)

            } catch (error) {
                console.log('Error al querer crear archivo de cero');
                throw error
            }
        }

        // En esta instancia del código el archivo en cuestión ya existe
        // ya sea desde antes de ejecutar este Constructor o porque yo lo cree líneas arriba inicializandolo con un array vacío
        try {
            const contenidoFile = JSON.parse(fs.readFileSync(archivo, 'utf-8'))
            for (const obj of contenidoFile) {
                if (obj.id > this.lastId) {
                    this.lastId = obj.id
                }
            }
            console.log('Objeto Contenedor creado en base al archivo:', archivo)

        } catch (error) {
            console.log(`El formato del contenido del archivo ${archivo} es incompatible con esta aplicación.
                        No puede obtenerse un Array de su parseo.`)
            throw error
        }
    }

    async getAll() { //return Object[] - Devuelve un array con los objetos presentes en el archivo.
        try {
            return JSON.parse(await fs.promises.readFile(this.archivo, 'utf-8'))

        } catch (error) {
            console.log('Error al querer leer el contenido del archivo:', this.archivo);
            throw error
        }
    }

    async save(objeto) { //return Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.

        if (objeto && Object.prototype.toString.call(objeto) === '[object Object]') { // Primero valido que el parámetro sea un objeto
            try {
                // Me traigo el array contenido del file y le hago un push del nuevo objeto
                // No uso el método appendFile (lo que me evitaría tener que leer todo)
                // porque sino me agregaría el objeto fuera del array...
                const contenidoFile = await this.getAll()

                const newObj = { ...objeto, id: this.lastId + 1 } // Agrego al objeto su id
                contenidoFile.push(newObj)

                await fs.promises.writeFile(this.archivo, JSON.stringify(contenidoFile, null, 2))

                this.lastId++ // Incremento post escritura por las dudas de que falle
                return this.lastId

            } catch (error) {
                console.log('Error al querer procesar el contenido del archivo:', this.archivo);
                throw error
            }
        } else {
            console.log('El parámetro no es un objeto');
            return null // Retorno null cuando no hay objeto para agregar al array del archivo
        }
    }

    async getById(number) { //return Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
        try {
            const contenidoFile = await this.getAll()
            return contenidoFile.find(obj => obj.id == number) ?? null

        } catch (error) {
            throw error
        }
    }

    async deleteById(number) { //: void - Elimina del archivo el objeto con el id buscado.
        try {
            const contenidoFile = await this.getAll()
            const newContenido = contenidoFile.filter(obj => obj.id !== number)

            if (contenidoFile.length > newContenido.length) { // Valido para no sobre-escribir file si no vale la pena
                await fs.promises.writeFile(this.archivo, JSON.stringify(newContenido, null, 2))

                console.log(`Eliminado del file objeto con id: ${number}`);

            } else {
                console.log(`No hay objeto con id: ${number} para eliminar. Contenido del file sigue igual`);
            }
        } catch (error) {
            throw error
        }
    }

    async deleteAll() { //: void - Elimina todos los objetos presentes en el archivo.
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify([]))
            console.log('Se ha vaciado el file:', this.archivo);

        } catch (error) {
            throw error
        }
    }
}

module.exports = Contenedor