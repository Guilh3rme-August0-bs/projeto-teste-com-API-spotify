const url = 'http://127.0.0.1:3000'

const textArea = document.getElementById('textArea')

var list = []

async function search(content, type) {

    const iconDiv = document.querySelector('.icon')
    const lyrics = document.querySelector('.lyrics')
    const lyricsDiv = document.querySelector('.lyrics-content')
    const textLyric = document.querySelector('.lyricsText')

    const contentPlus = content.replace(/ /g, '+')

    let resposta = await fetch(`${url}/search/?content=${contentPlus}&type=${type}`)
    let resultado = await resposta.json()

    list = resultado
    textArea.innerText = JSON.stringify(resultado, null, 2)
    //console.log(`tamanho do retorno: ${resultado.length}`)
    listar()

    iconDiv.style.display = 'block'
    lyricsDiv.style.display = 'none'
    lyrics.style.justifyContent = 'center'
    lyrics.style.overflowY = 'none'

}

function formatarTempo(ms) {
    let totalSegundos = Math.floor(ms / 1000);
    let minutos = Math.floor(totalSegundos / 60);
    let segundos = totalSegundos % 60;

    // Transforma em string e garante que tenha pelo menos 2 dígitos, preenchendo com '0'
    let segundosFormatados = segundos.toString().padStart(2, '0');

    return [`${minutos}:${segundosFormatados}`, totalSegundos];
}

async function preencherLyrics(artist, title, album, duration) {

    const iconDiv = document.querySelector('.icon')
    const lyrics = document.querySelector('.lyrics')
    const lyricsDiv = document.querySelector('.lyrics-content')
    const textLyric = document.querySelector('.lyricsText')

    const divTrack = document.querySelector('.trackList')

    lyrics.style.display = 'flex'
    divTrack.style.display = 'none'

    let resposta = await fetch(`${url}/lyrics/?artist_name=${artist}&track_name=${title}&album_name=${album}&duration=${duration}`)
    let resultado = await resposta.json()

    iconDiv.style.display = 'none'
    lyricsDiv.style.display = 'block'
    lyrics.style.justifyContent = 'flex-start'
    lyrics.style.overflowY = 'scroll'

    //console.log(resultado)

    if (resultado.erro) {
        textLyric.innerHTML = 'Não foi possível encontrar a letra desta faixa'
    } else {
        textLyric.innerHTML = resultado.plainLyrics
    }
}

async function preencherTrackList(img, name, artist, id) {

    let resposta = await fetch(`${url}/albums/?id=${id}`)
    let resultado = await resposta.json()

    const iconDiv = document.querySelector('.icon')
    const lyrics = document.querySelector('.lyrics')
    const divTrack = document.querySelector('.trackList')
    const divAlbum = divTrack.querySelector('.album-header')
    const divAlbumContent = divAlbum.querySelector('.album-header-content')

    const albumCover = divAlbum.querySelector('.cover_album')
    const albumTitle = document.getElementById('title-album')
    const albumArtist = document.getElementById('album-artist')

    const lista = divTrack.querySelector('.list-content')

    albumCover.src = img
    albumTitle.innerText = name
    albumArtist.innerText = artist

    iconDiv.style.display = 'none'
    lyrics.style.display = 'none'
    divTrack.style.display = 'flex'
    lista.innerHTML = ``

    for (let i = 0; i < resultado.length; i++) {
        lista.innerHTML += `
        <div class="album-item">
        <p class="track">${resultado[i].nome}</p>
        <p class="time">${formatarTempo(resultado[i].duracao)[0]}</p>
        </div>`
    }

}

//colorir div de letras pela cor da capa do álbum

function alterarCorPorImagem(urlDaImagem, seletorDiv) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = urlDaImagem;

    img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 1;
        canvas.height = 1;

        ctx.drawImage(img, 0, 0, 1, 1);
        const pixel = ctx.getImageData(0, 0, 1, 1).data;

        const r = pixel[0];
        const g = pixel[1];
        const b = pixel[2];

        // 1. Filtro de Cinza: Verifica proximidade entre os canais RGB
        const maxDiff = Math.max(r, g, b) - Math.min(r, g, b);
        const ehCinza = maxDiff < 25;

        // 2. Filtro de Brilho: Reduzido de 220 para 180 para barrar cores claras/pastéis
        const luminosidade = (0.299 * r + 0.587 * g + 0.114 * b);
        const ehMuitoClaro = luminosidade > 180;

        const elementoAlvo = document.querySelector(seletorDiv);
        if (!elementoAlvo) return;

        if (!ehCinza && !ehMuitoClaro) {
            // Fixa a transparência em exatamente 0.80
            elementoAlvo.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.80)`;
        } else {
            console.log("Cor rejeitada para garantir o contraste com o texto branco.");
            // Cor de segurança escura para garantir leitura do texto branco
            elementoAlvo.style.backgroundColor = '#1db954b4';
        }
    };
}

//selecionar track para mostrar letra
const elementoPai = document.querySelector('.results')

elementoPai.addEventListener('click', function (e) {


    const itemClicado = e.target.closest('.item')
    const lista = itemClicado.querySelector('.lista_div')
    const itemContent = lista.querySelector('.item_content')
    const artista = itemContent.querySelector('.artista')
    const title = itemContent.querySelector('.nome')
    const img = lista.querySelector('.cover_icon')
    const imgValue = img.src

    if (itemClicado) {

        const type = document.getElementById('select-input')
        const typeValue = type.value
        const artistaValue = artista.innerText
        const titleValue = title.innerText

        if (typeValue === 'track') {

            const segundos = itemContent.querySelector('.segundos')
            const segundosValue = segundos.innerText
            const album = itemContent.querySelector('.album')
            const albumValue = album.innerText

            preencherLyrics(artistaValue, titleValue, albumValue, segundosValue)
            alterarCorPorImagem(imgValue, '.lyrics')
        }
        if (typeValue === 'album') {
            const id = itemContent.querySelector('.albumId')
            const idValue = id.innerText

            preencherTrackList(imgValue, titleValue, artistaValue, idValue)
            alterarCorPorImagem(imgValue, '.trackList')
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
                    <li class="duracao">${formatarTempo(list[i].duracao)[0]}</li>
                    <li class="segundos" style="display: none">${formatarTempo(list[i].duracao)[1]}</li>
                    <!--<li class="explicit">${explicitCheck(list[i].explicit)}</li>-->
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
            <li class="albumId" style="display: none">${list[i].id}</li>
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