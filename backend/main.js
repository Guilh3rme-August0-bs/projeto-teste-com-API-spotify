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


        // const resultado = data.tracks.items.map(track => ({
        //     nome: track.name,
        //     artista: track.artists[0].name,
        //     album: track.album.name,
        //     imagem: track.album.images[0]?.url,
        //     preview: track.preview_url

        // }))

        // res.json(resultado)

        function typeCheck(type) {

            if (type === 'track') {
                const resultado = data.tracks.items.map(track => ({
                    nome: track.name,
                    artista: track.artists[0].name,
                    album: track.album.name,
                    imagem: track.album.images[0]?.url,
                    preview: track.preview_url,
                    lancamento: track.album.release_date,
                    duracao: track.duration_ms,
                    popularidade: track.popularity,
                    explicit: track.explicit,
                    link: track.external_urls.spotify
                }))
                return resultado
            }

            if (type === 'album') {
                const resultado = data.albums.items.map(album => ({
                    nome: album.name,
                    artista: album.artists[0]?.name,
                    imagem: album.images[0]?.url || null,
                    lancamento: album.release_date,
                    link: album.external_urls.spotify,
                    id: album.id
                }));
                return resultado
            }
        }

        res.json(typeCheck(typeSearch))

    } catch (erro) {
        console.log(erro)
        res.status(500).send("Erro interno")
    }
});

app.get('/albums', async (req, res) => {

    const Id = req.query.id

    try {

        const url = `https://api.spotify.com/v1/albums/${Id}`
        let token = getTokenCache()

        // retry automático
        if (!token) {
            token = await gerarToken();
        }

        const resposta = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const data = await resposta.json()

        if (!data.tracks || !data.tracks.items) {
            return res.json([])
        }

        const tracks = data.tracks.items.map(track => ({
            nome: track.name,
            artistas: track.artists.map(a => a.name).join(", "),
            duracao: track.duration_ms,
            preview: track.preview_url,
            faixa: track.track_number
        }))

        res.json(tracks)

    }
    catch (erro) {
        console.log(erro)
        res.status(500).send(`Erro interno: ${erro}`)
    }

})

app.get('/lyrics', async (req, res) => {

    const artist = req.query.artist
    const title = req.query.title

    try {
        //await pausa a função até que a promise seja concluída     
        const resposta = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
        /* na variável "dados", o await é usado para que o retorno 
        não seja "pending" (promise pendente), assim a linha não é 
        executada antes do retorno da promise */
        const dados = await resposta.json()

        if (dados.error) {
            throw new Error('Não foi possível encontrar a letra desta faixa')
        }
        res.json(dados)

    } catch (erro) {
        console.log(`erro ao buscar canção`)
        res.status(404).json({ erro: erro.message })
    }
})

app.listen(PORT, () => {
    console.log(`App rodando em http://127.0.0.1:${PORT}`)
})