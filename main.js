const express = require('express')
const app = express()
require('dotenv').config()

//const { gerarToken } = require("./autenticacao.js")

const PORT = 3000

//rota para pesquisar artista, album, track

let urlSearch = 'https://api.spotify.com/v1/search?q=${contentPlus}&type=${typeSearch}&limit=${limit}&include_external=audio'

const typeSearch = ['album', 'artist', 'track']
const index = 2
const limit = [10, 20, 50, 100]
const indexLimit = 0
const content = 'Michael Jackson'
const contentPlus = content.replace('', '+')

//'https://api.spotify.com/v1/search?q=${contentPlus}&type=${typeSearch}&limit=${limit[indexLimit]}&include_external=audio'

urlSearchReplace = urlSearch.replace('${contentPlus}', contentPlus)
    .replace('${typeSearch}', typeSearch[index])
    .replace('${limit}', limit[indexLimit])

app.get('/search', async (req, res) => {

    //const token = await gerarToken();

    //preencher (no ".env") com token gerado no "autenticacao.js"
    const token = process.env.TOKEN
    const resposta = await fetch(urlSearchReplace, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await resposta.json();

    const resultado = data.tracks.items.map(track => ({
        nome: track.name,
        artista: track.artists[0].name,
        album: track.album.name,
        imagem: track.album.images[0]?.url
       
    }))

    res.json(resultado)

    console.log("STATUS:", resposta.status);
    //console.log(data);

    res.send(resultado);
});

app.listen(PORT, () => {
    console.log(`App rodando em http://127.0.0.1:${PORT}`)
})