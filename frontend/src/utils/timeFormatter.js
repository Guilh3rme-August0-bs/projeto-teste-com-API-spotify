export function formatarTempo(ms) {
    const totalSegundos = Math.floor(ms / 1000)
    const minutos = Math.floor(totalSegundos / 60)
    const segundos = totalSegundos % 60
    return [`${minutos}:${String(segundos).padStart(2, '0')}`, totalSegundos]
}