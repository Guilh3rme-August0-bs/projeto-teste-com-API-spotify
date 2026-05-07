require('dotenv').config()

const clientID = process.env.ID
const clientSecret = process.env.SECRET

const credentials = Buffer.from(`${clientID}:${clientSecret}`).toString("base64");

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
        // return data.access_token
        //const data = await resposta.json()
        .then(res => res.json())
        .then(data => console.log(data.access_token))

    } catch (erro) {
        console.log(erro)
    }

}

gerarToken()

/* BQAz2vN6zYn6r_ACn96eijhyF3T-YUpIFjO6l1jeZsVs0n_DfHI9wb3l9FTBcFtZk8jccaozfMXjytmUFi_uQPX0teNnVNPOPLBwG9rvaZ81_0Ax6GZyrdK2_WtEpU0AyjVtpPqo7to */

//console.log(gerarToken())

/*

dados.access_token
dados.token_type
dados.expires_in

*/

//module.exports = { gerarToken }