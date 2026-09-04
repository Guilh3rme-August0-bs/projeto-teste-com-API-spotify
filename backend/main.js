import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express()
const PORT = 3000

app.use(cors())

import {
    gerarToken,
    getTokenCache,
    getLoginUrl,
    trocarCodigoPorToken,
    getUserToken
} from './autenticacao.js';

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

        let resposta = await fetch(urlSearch, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (resposta.status === 401) {
            token = await gerarToken()

            resposta = await fetch(urlSearch, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        const data = await resposta.json();

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

    const artist = req.query.artist_name
    const title = req.query.track_name
    const album = req.query.album_name
    const duration = req.query.duration

    try {
        const resposta = await fetch(`https://lrclib.net/api/get?artist_name=${artist}&track_name=${title}&album_name=${album}&duration=${duration}`)
        const dados = await resposta.json()

        if (dados.statusCode === 404 || dados.statusCode === 400) {
            throw new Error('Não foi possível encontrar a letra desta faixa')
        }
        res.json(dados)

    } catch (erro) {
        res.json({ "erro": erro })
    }
})

app.get('/login', (req, res) => {
    res.redirect(getLoginUrl())
})

app.get('/callback', async (req, res) => {
    try {
        const { code, error } = req.query

        if (error) {
            return res.status(400).send(`Autorização negada: ${error}`)
        }

        await trocarCodigoPorToken(code)

        res.redirect('http://localhost:5173/topsongs')
    } catch (erro) {
        console.error(erro)
        res.status(500).send('Erro ao autenticar com o Spotify')
    }
})

app.get('/recently-played', async (req, res) => {
    try {
        const token = await getUserToken()

        if (!token) {
            return res.status(401).json({
                error: 'Usuário não autenticado',
                login: 'http://localhost:3000/login'
            })
        }

        const limit = Math.min(Number(req.query.limit) || 10, 50)
        const after = req.query.after

        const params = new URLSearchParams({
            limit: String(limit)
        })

        if (after) {
            params.set('after', String(after))
        }

        const resposta = await fetch(
            `https://api.spotify.com/v1/me/player/recently-played?${params}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        const dados = await resposta.json()

        if (!resposta.ok) {
            return res.status(resposta.status).json(dados)
        }

        res.json(dados)
    } catch (erro) {
        console.error(erro)
        res.status(500).send('Erro interno')
    }
})

app.listen(PORT, () => {
    console.log(`App rodando em http://127.0.0.1:${PORT}`)
})