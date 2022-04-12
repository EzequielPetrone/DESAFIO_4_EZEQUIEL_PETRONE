const APIPATH = '/api/productos'
const FORM_APIPATH = APIPATH + '/form'

const elem = document.querySelector("#prodForm");
elem.addEventListener('submit', async (e) => {
    e.preventDefault()
    try {
        e.target.enctype = "multipart/form-data"
        const resp = await fetch(FORM_APIPATH, { body: new FormData(elem), method: 'POST' })
        if (resp.status < 400) {
            alert('Nuevo producto guardado!\n' + JSON.stringify(await resp.json(), null, 2))
            e.target.reset()
        } else {
            alert('Hubo algún error!')
        }
    } catch (error) {
        console.error(error);
    }
})

const btn = document.querySelector("#btnTestApi");
btn.addEventListener('click', async () => {
    try {
        const resp = await fetch(APIPATH)
        const arrayP = await resp.json()
        for (const p of arrayP) {
            console.log(p);
        }
    } catch (error) {
        console.error(error);
    }
})