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