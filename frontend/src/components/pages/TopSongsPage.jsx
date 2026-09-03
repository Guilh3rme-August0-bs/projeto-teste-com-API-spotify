import { getTopSongs } from "../../services/client"
import { useEffect, useState } from "react"



export const TopSongsPage = () => {

    const [songList, setSongList] = useState([])

    useEffect(() => {
        async function loadSongs() {
            const songs = await getTopSongs(10, 10);
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
                            <h1>
                                Top Songs
                            </h1>

                            <textarea
                                className="border-white border-2 p-4 h-full hidden"
                                value={JSON.stringify(songList, null, 2)}
                                readOnly
                            />
                            <div className="overflow-y-scroll h-160 gap-4 flex flex-col">

                                {songList.length > 0 ? (
                                    songList.map((song, index) => (
                                        <div key={index} className="flex flex-row gap-4 p-4 rounded-2xl bg-white/5">
                                            <img width="100" src={song[2]} alt={song[0]} />
                                            <div className="flex flex-col gap-1">
                                                <h2>{song[0]}</h2>
                                                <p>{song[1]}</p>
                                                <p>{song[3]}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Sem faixas listadas</p>
                                )}

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}