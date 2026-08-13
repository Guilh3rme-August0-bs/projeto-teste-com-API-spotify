import { preencherLyrics } from '../../services/client';

export const ResultsList = ({ list, type }) => {

    function formatarTempo(ms) {
        const totalSegundos = Math.floor(ms / 1000)
        const minutos = Math.floor(totalSegundos / 60)
        const segundos = totalSegundos % 60
        return [`${minutos}:${String(segundos).padStart(2, '0')}`, totalSegundos]
    }

    return (
        <div
            className="flex h-[73vh] max-h-full flex-col gap-3 overflow-y-auto pr-1
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-track]:bg-slate-700
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-[var(--main-color)]
                [&::-webkit-scrollbar-thumb:hover]:bg-[#1f8a38]"
        >
            {list.map((item, index) => {
                const isTrack = typeof item.duracao !== 'undefined';

                return (
                    <div
                        key={item.link || item.id || index}
                        className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-bg-card p-3 shadow-md"
                    >
                        <img
                            className="h-24 w-24 object-cover"
                            src={item.imagem}
                            alt={item.nome}
                        />

                        <div className="min-w-0 flex-1 justify-between gap-2 sm:flex sm:items-center sm:gap-4">
                            <ul className="space-y-1 text-slate-200">
                                <li className="truncate text-[12px] font-semibold text-white">{item.nome}</li>
                                <li className="text-[9px] text-slate-400">{item.artista}</li>

                                {item.album && (
                                    <li className="text-[9px] text-slate-400">{item.album}</li>
                                )}

                                {item.lancamento && (
                                    <li className="text-[9px] text-slate-400">{item.lancamento}</li>
                                )}

                                {isTrack && (
                                    <li className="text-[9px] text-slate-400">
                                        {formatarTempo(item.duracao)?.[0]}
                                    </li>
                                )}

                            </ul>
                            <div className="flex flex-col items-end gap-1">
                                <a
                                    href={item.link}
                                    className="inline-flex items-center text-[10px] font-medium text-main-color hover:underline"
                                >
                                    Ouvir
                                </a>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}