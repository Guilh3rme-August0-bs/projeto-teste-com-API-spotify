const url = 'http://127.0.0.1:3000/search/?'

const textArea = document.getElementById('textArea')

async function search(content, type) {

    const contentPlus = content.replace(/ /g, '+')

    let resposta = await fetch(`${url}content=${contentPlus}&type=${type}`)

    let resultado = await resposta.json()
    
    textArea.innerText = JSON.stringify(resultado, null, 2)
    console.log(`tamanho do retorno: ${resultado.length}`)
}

document.querySelector('.search-button').addEventListener('click', function () {

console.log('siiiim')

    const content = document.getElementById('search-input')
    const type = document.getElementById('select-input')

    const contentValue = content.value
    const typeValue = type.value

    search(contentValue, typeValue)

});
