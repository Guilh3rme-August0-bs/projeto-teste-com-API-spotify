import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MusicData } from './MusicData';
import { search } from '../../services/client';
import { ResultsList } from './ResultsList';
import { preencherTrackList, preencherLyrics } from '../../services/client';

export const SearchPage = () => {

    const [term, setTerm] = useState('')
    const [list, setList] = useState([])
    const [data, setData] = useState([])
    const [type, setType] = useState('track')
    const [cover, setCover] = useState('')

    const changeType = (e) => {
        const nextType = e.target.value;
        setType(nextType);
    };

    const handleSearch = async () => {
        const result = await search(term, type);
        setList(result);
    };

    const handleItemClick = async (item) => {

        let finalData = [];
        const trackData = await preencherTrackList(item.imagem, item.nome, item.artista, item.id);
        
        // Converte a duração para segundos
        const durationSeconds = typeof item.duracao === 'number' && item.duracao > 100000 
            ? Math.round(item.duracao / 1000)  // Se estiver em ms, converte para segundos
            : item.duracao;  // Se já estiver em segundos, usa direto
        
        const lyricsData = await preencherLyrics(item.artista, item.nome, item.album, durationSeconds);

        if (type === 'album') {
            finalData = trackData;
            setCover(item.imagem);
        } else {
            finalData = lyricsData;
        }

        setData(finalData);
    };

    return (
        <div className="flex h-full w-full flex-col gap-4 bg-bg-card text-white">
            <div className="flex h-full flex-1 flex-col gap-4 md:flex-row">
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
                                    onKeyDown={async (e) => {
                                        if (e.key === 'Enter') {
                                            const result = await search(term, type)
                                            setList(result)
                                        }
                                    }}
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
                                        className="inline-flex h-12 w-12 items-center justify-center cursor-pointer rounded-2xl bg-main-color text-white"
                                        onClick={handleSearch}
                                    >
                                        <Search size={18} />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-hidden rounded-3xl bg-card-color p-3 shadow-xl sm:p-4">
                        <ResultsList list={list} onItemClick={handleItemClick} />
                    </div>
                </div>

                <div className="md:flex-1">
                    <div className="flex min-h-55 flex-1 rounded-3xl bg-card-color p-3 shadow-xl sm:p-4 md:min-h-0 md:h-full">
                        <MusicData data={data} cover={cover} />
                    </div>
                </div>
            </div>
        </div>
    )
}
