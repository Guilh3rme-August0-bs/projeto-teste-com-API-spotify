import 'dotenv/config';

const clientID = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const redirectURI = process.env.SPOTIFY_REDIRECT_URI

const credentials = Buffer
    .from(`${clientID}:${clientSecret}`)
    .toString('base64')

let appToken = null
let appTokenExpiraEm = 0

let userToken = null
let userRefreshToken = null
let userTokenExpiraEm = 0

export function getLoginUrl() {
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientID,
        scope: 'user-read-recently-played',
        redirect_uri: redirectURI
    })

    return `https://accounts.spotify.com/authorize?${params}`
}

export async function trocarCodigoPorToken(code) {
    const resposta = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectURI
        })
    })

    const data = await resposta.json()

    if (!resposta.ok) {
        throw new Error(JSON.stringify(data))
    }

    userToken = data.access_token
    userRefreshToken = data.refresh_token || userRefreshToken
    userTokenExpiraEm = Date.now() + data.expires_in * 1000

    return userToken
}

async function renovarUserToken() {
    const resposta = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: userRefreshToken
        })
    })

    const data = await resposta.json()

    if (!resposta.ok) {
        throw new Error(JSON.stringify(data))
    }

    userToken = data.access_token
    userTokenExpiraEm = Date.now() + data.expires_in * 1000

    return userToken
}

export async function getUserToken() {
    if (!userToken) return null

    if (Date.now() >= userTokenExpiraEm - 60000) {
        return renovarUserToken()
    }

    return userToken
}

export async function gerarToken() {
    if (appToken && Date.now() < appTokenExpiraEm) {
        return appToken
    }

    const resposta = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials'
        })
    })

    const data = await resposta.json()

    if (!resposta.ok) {
        throw new Error(JSON.stringify(data))
    }

    appToken = data.access_token
    appTokenExpiraEm = Date.now() + data.expires_in * 1000

    return appToken
}

export function getTokenCache() {
    return appToken && Date.now() < appTokenExpiraEm
        ? appToken
        : null
}
