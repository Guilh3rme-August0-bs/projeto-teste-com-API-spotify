require('dotenv').config()

const clientID = process.env.ID
const clientSecret = process.env.SECRET

const credentials = Buffer.from(`${clientID}:${clientSecret}`).toString("base64");

async function gerarToken() {

    try {
        const resposta = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${credentials}`
            },
            body: "grant_type=client_credentials"
        });

        const data = await resposta.json();
        return data.access_token
        
    } catch (erro) {
        console.log(erro)
    }

}

//console.log(gerarToken())

/*

dados.access_token
dados.token_type
dados.expires_in

*/

module.exports = { gerarToken }