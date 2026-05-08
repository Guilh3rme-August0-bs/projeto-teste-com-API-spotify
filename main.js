const express = require('express')
const app = express()
require('dotenv').config()

const { gerarToken, getTokenCache } = require("./autenticacao.js")

const PORT = 3000

//rota para pesquisar artista, album, track

const typeSearch = ['album', 'artist', 'track']
const index = 2
const limit = [10, 20, 50, 100]
const indexLimit = 0

const content = 'Michael Jackson'
const contentPlus = content.replace(/ /g, '+')

//'https://api.spotify.com/v1/search?q=${contentPlus}&type=${typeSearch}&limit=${limit[indexLimit]}&include_external=audio'


app.get('/search', async (req, res) => {


    try {

        let token = getTokenCache()

        if (!token) {
            token = await gerarToken();
        }

        const urlSearch = `https://api.spotify.com/v1/search?q=${contentPlus}&type=${typeSearch[index]}&limit=${limit[indexLimit]}&include_external=audio`

        //preencher (no ".env") com token gerado no "autenticacao.js"

        let resposta = await fetch(urlSearch, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // retry automático
        if (resposta.status === 401) {
            token = await gerarToken()

            resposta = await fetch(urlSearch, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        const data = await resposta.json();

        if (!data.tracks || !data.tracks.items) {
            return res.status(400).json(data)
        }

        const resultado = data.tracks.items.map(track => ({
            nome: track.name,
            artista: track.artists[0].name,
            album: track.album.name,
            imagem: track.album.images[0]?.url,
            preview: track.preview_url

        }))

        res.json(resultado)

    } catch (erro) {
        console.log(erro)
        res.status(500).send("Erro interno")
    }
});

app.listen(PORT, () => {
    console.log(`App rodando em http://127.0.0.1:${PORT}`)
})