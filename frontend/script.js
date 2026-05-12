const url = 'http://127.0.0.1:3000/search/?'

const textArea = document.getElementById('textArea')

var list = []

async function search(content, type) {

    const contentPlus = content.replace(/ /g, '+')

    let resposta = await fetch(`${url}content=${contentPlus}&type=${type}`)

    let resultado = await resposta.json()

    
    list = resultado
    textArea.innerText = JSON.stringify(resultado, null, 2)
    console.log(`tamanho do retorno: ${resultado.length}`)
    listar()
}

document.querySelector('.search-button').addEventListener('click', function () {


    const content = document.getElementById('search-input')
    const type = document.getElementById('select-input')

    const contentValue = content.value
    const typeValue = type.value

    search(contentValue, typeValue)

});

//criar lista com resultados

function listar() {

    /* 
    
        nome
        artista
        album
        imagem
        preview

    */
    
    for (let i = 0; i < list.length; i++) {

        const body = document.querySelector('.results')
        const lista_div = document.createElement('div')
        lista_div.classList.add('item')

        const lista_anterior = document.querySelectorAll('.item')

        if (lista_anterior.length >= 10) {
            lista_anterior.forEach(el => el.remove())
        }

        lista_div.innerHTML = `<div class="lista_div">
            <img class="cover_icon" src=${list[i].imagem}>
            <div class="item_content">
                <ul>
                    <li class="nome">${list[i].nome}</li>
                    <li class="artista">${list[i].artista}</li>
                    <li class="album">${list[i].album}</li>
                </ul>
            </div>
        </div>`

        body.appendChild(lista_div)
        console.log(`item: ${i}`)
    }
}