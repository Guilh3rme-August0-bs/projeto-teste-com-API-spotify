const express = require('express')
const app = express()

const { gerarToken } = require("./autenticacao.js")

const PORT = 3000
const url = 'https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb'

app.get('/get', async (req, res) => {

    const token = await gerarToken();

    const resposta = await fetch('https://api.spotify.com/v1/browse/new-releases?country=BR&limit=10', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await resposta.json();

    console.log("STATUS:", resposta.status);
    console.log(data);

    res.send(data);
});

app.listen(PORT, () => {
    console.log(`App rodando em http://127.0.0.1:${PORT}`)
})