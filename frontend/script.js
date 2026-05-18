const url = 'http://127.0.0.1:3000'

const textArea = document.getElementById('textArea')

var list = []

async function search(content, type) {

    const contentPlus = content.replace(/ /g, '+')

    let resposta = await fetch(`${url}/search/?content=${contentPlus}&type=${type}`)
    let resultado = await resposta.json()

    list = resultado
    textArea.innerText = JSON.stringify(resultado, null, 2)
    console.log(`tamanho do retorno: ${resultado.length}`)
    listar()
}

async function preencherLyrics(artist, title) {

    const iconDiv = document.querySelector('.icon')
    const lyricsDiv = document.querySelector('.lyrics-content')
    const textLyric = document.querySelector('.lyricsText')

    let resposta = await fetch(`${url}/lyrics/?artist=${artist}&title=${title}`)

    let resultado = await resposta.json()

    iconDiv.style.display = 'none'
    lyricsDiv.style.display = 'block'
    textLyric.innerHTML = resultado.lyrics
}

//selecionar track para mostrar letra
const elementoPai = document.querySelector('.results')

elementoPai.addEventListener('click', function (e) {

    const type = document.getElementById('select-input')
    const typeValue = type.value

    const itemClicado = e.target.closest('.item')
    const lista = itemClicado.querySelector('.lista_div')
    const itemContent = lista.querySelector('.item_content')
    const artista = itemContent.querySelector('.artista')
    const title = itemContent.querySelector('.nome')

    if (itemClicado) {

        const artistaValue = artista.innerText
        const titleValue = title.innerText

        if (typeValue === 'track') {
            preencherLyrics(artistaValue, titleValue)
        }
    }

})


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

    const content = document.getElementById('search-input')
    const type = document.getElementById('select-input')

    const contentValue = content.value
    const typeValue = type.value

    for (let i = 0; i < list.length; i++) {


        const body = document.querySelector('.results')
        const lista_div = document.createElement('div')
        lista_div.classList.add('item')

        const lista_anterior = document.querySelectorAll('.item')

        if (lista_anterior.length >= 10) {
            lista_anterior.forEach(el => el.remove())
        }

        function formatarTempo(ms) {
            let totalSegundos = Math.floor(ms / 1000);
            let minutos = Math.floor(totalSegundos / 60);
            let segundos = totalSegundos % 60; // Pega o resto da divisão

            segundos = parseFloat(segundos.toFixed(2))

            return `${minutos}:${segundos}`;
        }

        function explicitCheck(explicit) {
            return explicit ? 'conteúdo explícito' : 'sem conteúdo explícito'
        }

        switch (typeValue) {
            case 'track':

                lista_div.innerHTML = `<div class="lista_div">
            <img class="cover_icon" src=${list[i].imagem}>
            <div class="item_content">
                <ul>
                    <li class="nome">${list[i].nome}</li>
                    <li class="artista">${list[i].artista}</li>
                    <li class="album">${list[i].album}</li>
                    <li class="lancamento">${list[i].lancamento}</li>
                    <li class="duracao">${formatarTempo(list[i].duracao)}</li>
                    <li class="explicit">${explicitCheck(list[i].explicit)}</li>
                    <a href="${list[i].link}" class="link">Ouvir</a>
                </ul>
            </div>
        </div>`

                break

            case 'album':

                lista_div.innerHTML = `<div class="lista_div">
            <img class="cover_icon" src=${list[i].imagem}>
            <div class="item_content">
                <ul>
                    <li class="nome">${list[i].nome}</li>
                    <li class="artista">${list[i].artista}</li>
                    <li class="lancamento">${list[i].lancamento}</li>
                    <a href="${list[i].link}" class="link">Ouvir</a>
                </ul>
            </div>
        </div>`

                break

            default:

                lista_div.innerHTML = ''

                break

        }


        body.appendChild(lista_div)
        //console.log(`item: ${i}`)
    }
}