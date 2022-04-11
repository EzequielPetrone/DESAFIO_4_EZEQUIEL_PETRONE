const APIPATH = '/api/productos'

async function obtenerProductos() {
    try {
        const resp = await fetch(APIPATH + '/')
        const miarray = await resp.json()
        for (const p of miarray) {
            console.log(p);
        }
    } catch (error) {
        console.log(error);
    }
}

const elem = document.querySelector(".ejecutor");
elem.addEventListener('click', obtenerProductos)
