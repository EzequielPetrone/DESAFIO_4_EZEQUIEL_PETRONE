const APIPATH = '/api/productos'
const FORM_APIPATH = APIPATH + '/form'

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

const elem = document.querySelector("#prodForm");
//elem.addEventListener('submit', e => e.target.reset())
elem.addEventListener('submit', async (e) => {
    e.preventDefault()
    try {
        const resp = await fetch(FORM_APIPATH, { body: new FormData(elem), method: 'POST' })
        if (resp.status < 400) {
            alert('Nuevo producto guardado!\n' + JSON.stringify(await resp.json(), null, 2))
            elem.reset()
        } else {
            alert('Hubo algún error!')
        }
    } catch (error) {
        console.log(error);
    }
})

//frmFormComplete