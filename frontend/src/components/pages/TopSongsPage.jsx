import { getTopSongs } from "../../services/client"
import { useEffect, useState } from "react"

export const TopSongsPage = () => {

    const [songList, setSongList] = useState([])

    const dateConvert = (date) => {

        const dataObj = new Date(date);
        const completeDate = dataObj.toLocaleString('pt-BR');

        return completeDate
    }

    useEffect(() => {
        async function loadSongs() {
            const songs = await getTopSongs(100, 10);
            setSongList(songs)
        }

        loadSongs()
    }, [])

    return (
        <div className="flex h-full min-h-0 w-full flex-col gap-4 bg-bg-card text-white">
            <div className="flex min-h-0 flex-1 flex-col gap-4 md:flex-row">
                <div className="flex min-h-0 flex-1 flex-col gap-4">
                    <div className="rounded-3xl bg-card-color p-4 shadow-xl sm:p-5">
                        <div className="flex flex-col gap-3">
                            <h1 className="text-2xl font-bold">
                                Top Songs
                            </h1>

                            <textarea
                                className="border-white border-2 p-4 h-full hidden"
                                value={JSON.stringify(songList, null, 2)}
                                readOnly
                            />
                            <div className="gap-4 flex flex-col h-[82vh] overflow-y-auto pr-1
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-track]:bg-slate-700
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-(--main-color)
                [&::-webkit-scrollbar-thumb:hover]:bg-[#1f8a38]">

                                {songList.length > 0 ? (
                                    songList.map((song, index) => (
                                        <div key={index} className="flex flex-row gap-4 p-4 rounded-2xl bg-white/5">
                                            <img width="100" src={song.image} alt={song.track} />
                                            <div className="flex flex-col">
                                                <ul className="flex flex-col gap-2">
                                                    <li className="truncate text-3x1 font-semibold text-white">{song.track}</li>
                                                    <li className="text-[13px] text-slate-400">{song.album}</li>
                                                    <li className="text-[13px] text-slate-400">{song.artist}</li>
                                                    <li className="text-[13px] text-slate-400">
                                                        <span className="text-[13px] text-white">Data de reprodução:</span>  {dateConvert(song.played_at)}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col gap-6">
                                        <p>Sem faixas listadas</p>
                                        <p>Tente fazer login novamente</p>
                                        <a className="text-2xl text-black w-37.5 font-bold p-3 rounded-3xl bg-green-500"
                                            href="http://127.0.0.1:3000/callback"
                                            target="_blank"
                                            rel="noopener noreferrer">
                                            Fazer login</a>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}