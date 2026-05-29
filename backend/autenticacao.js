//require('dotenv').config()
import 'dotenv/config';

const clientID = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET

const credentials = Buffer.from(`${clientID}:${clientSecret}`).toString("base64");

//armazenar token gerado em cache
let tokenCache = null
let tokenExpiraEm = 0

async function gerarToken() {

    try {
        let resposta = await
            fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${credentials}`
                },
                body: "grant_type=client_credentials"
            })

        const data = await resposta.json()

        tokenCache = data.access_token;
        tokenExpiraEm = Date.now() + (data.expires_in * 1000)

        if (!data.access_token) {
            throw new Error("Erro ao gerar token: " + JSON.stringify(data))
        }

        return tokenCache


    } catch (erro) {
        console.log(erro)
    }

}
function getTokenCache() {

    if (!tokenCache || Date.now() > tokenExpiraEm) {
        return null
    }
    return tokenCache
}

export { gerarToken, getTokenCache }

/*

dados.access_token
dados.token_type
dados.expires_in

*/
