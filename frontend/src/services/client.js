const url = 'http://localhost:3000'

export async function search(content, type) {

    const contentPlus = content.replace(/ /g, '+')

    let resposta = await fetch(`${url}/search/?content=${contentPlus}&type=${type}`)
    let resultado = await resposta.json()
    return resultado

}

export async function preencherLyrics(artist, title, album, duration) {

    let resposta = await fetch(`${url}/lyrics/?artist_name=${artist}&track_name=${title}&album_name=${album}&duration=${duration}`)
    let resultado = await resposta.json()

    if (resultado.erro) {
        return 'Não foi possível encontrar a letra desta faixa'
    } else {
        return resultado
    }

}

export async function preencherTrackList(img, name, artist, id) {

    let resposta = await fetch(`${url}/albums/?id=${id}`)
    let resultado = await resposta.json()
    return resultado

}

export async function getTopSongs(limit, after) {

    let resposta = await fetch(`${url}/recently-played/?limit=${limit}${after ? `&after=${after}` : ''}`)
    let resultado = await resposta.json()

    if (resultado.erro) {
        return 'Não foi possível carregar as faixas, tente fazer login novamente'
    } else {

        let newArray = resultado.items.map(item => ({
            track: item.track.name,
            album: item.track.album.name,
            image: item.track.album.images[1].url,
            artist: item.track.album.artists[0].name,
            played_at: item.played_at
        }))

        return newArray
    }
}