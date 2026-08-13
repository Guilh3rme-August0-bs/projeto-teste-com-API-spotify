import { Search } from 'lucide-react';
import { useState } from 'react';
import { MusicData } from './MusicData';
import { search } from '../../services/client';

export const SearchPage = () => {
    const [term, setTerm] = useState('')
    const [data, setData] = useState([])
    const [type, setType] = useState('track')

    const changeType = (e) => setType(e.target.value)

    function formatarTempo(ms) {
        const totalSegundos = Math.floor(ms / 1000)
        const minutos = Math.floor(totalSegundos / 60)
        const segundos = totalSegundos % 60
        return [`${minutos}:${String(segundos).padStart(2, '0')}`, totalSegundos]
    }

    return (
        <div className="flex h-full min-h-0 w-full flex-col gap-4 bg-bg-card text-white">
            <div className="flex min-h-0 flex-1 flex-col gap-4 md:flex-row">
                <div className="flex min-h-0 flex-1 flex-col gap-4">
                    <div className="rounded-3xl bg-card-color p-4 shadow-xl sm:p-5">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <input
                                    type="text"
                                    className="w-full flex-1 rounded-2xl border border-slate-700 bg-bg-card px-4 py-3 text-sm outline-none focus:border-sky-500"
                                    id="search-input"
                                    placeholder="Pesquisar..."
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                />

                                <div className="flex gap-3">
                                    <div className="min-w-27.5 rounded-2xl border border-slate-700 bg-bg-card">
                                        <select
                                            id="select-input"
                                            className="w-full appearance-none rounded-2xl bg-transparent px-3 py-3 text-center text-sm outline-none"
                                            onChange={changeType}
                                        >
                                            <option value="track">Track</option>
                                            <option value="album">Album</option>
                                        </select>
                                    </div>

                                    <button
                                        className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-main-color text-white"
                                        onClick={async () => {
                                            const result = await search(term, type)
                                            setData(result)
                                        }}
                                    >
                                        <Search size={18} />
                                    </button>
                                </div>
                            </div>

                            <textarea
                                className="hidden w-full min-h-22.5 resize-none rounded-2xl border border-slate-700 bg-bg-card px-4 py-3 text-sm outline-none focus:border-main-color"
                                placeholder="Descrição..."
                                id="textArea"
                            />
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-hidden rounded-3xl bg-card-color p-3 shadow-xl sm:p-4">
                        <div className="flex h-[73vh] max-h-full flex-col gap-3 overflow-y-scroll pr-1">
                            {data.map((item, index) => (
                                <div
                                    key={item.link || index}
                                    className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-bg-card p-3 shadow-md"
                                >
                                    <img
                                        className="h-24 w-24 object-cover"
                                        src={item.imagem}
                                        alt={item.nome}
                                    />

                                    <div className="min-w-0 flex-1">
                                        <ul className="space-y-1 text-slate-200">
                                            <li className="truncate text-[12px] font-semibold text-white">{item.nome}</li>
                                            <li className="text-[9px] text-slate-400">{item.artista}</li>
                                            <li className="text-[9px] text-slate-400">{item.album}</li>
                                            <li className="text-[9px] text-slate-400">{item.lancamento}</li>
                                            <li className="text-[9px] text-slate-400">{formatarTempo(item.duracao)?.[0]}</li>
                                            <li className="hidden">{formatarTempo(item.duracao)?.[1]}</li>
                                            <li className="pt-1">
                                                <a
                                                    href={item.link}
                                                    className="inline-flex items-center text-[10px] font-medium text-main-color hover:underline"
                                                >
                                                    Ouvir
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-96">
                    <div className="flex min-h-55 flex-1 rounded-3xl bg-card-color p-3 shadow-xl sm:p-4 md:min-h-0 md:h-full">
                        <MusicData data={data} type={type} />
                    </div>
                </div>
            </div>
        </div>
    )
}