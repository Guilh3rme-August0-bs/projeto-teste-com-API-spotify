const express = require('express')
const app = express()
require('dotenv').config()

// CORS: permite que o frontend (rodando em outra porta/origem) consiga fazer requisições para este backend
const cors = require('cors')
app.use(cors())

const { gerarToken, getTokenCache } = require("./autenticacao.js")

const PORT = 3000

//rota para pesquisar artista, album, track

// const contentPlus = content.replace(/ /g, '+')

//url teste:

//http://127.0.0.1:3000/search/?content=Rolling%20Stones&type=track


app.get('/search', async (req, res) => {
    
const limit = 10
const content = req.query.content
const contentPlus = content.replace(/ /g, '+')
const typeSearch = req.query.type

    try {

        let token = getTokenCache()

        if (!token) {
            token = await gerarToken();
        }

        const urlSearch = `https://api.spotify.com/v1/search?q=${contentPlus}&type=${typeSearch}&limit=${limit}&include_external=audio`

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