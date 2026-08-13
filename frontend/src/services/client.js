const url = 'http://localhost:3000'

export async function search(content, type) {

    const iconDiv = document.querySelector('.icon')
    const lyrics = document.querySelector('.lyrics')
    const lyricsDiv = document.querySelector('.lyrics-content')
    const textLyric = document.querySelector('.lyricsText')

    const contentPlus = content.replace(/ /g, '+')

    let resposta = await fetch(`${url}/search/?content=${contentPlus}&type=${type}`)
    let resultado = await resposta.json()
    return resultado

}