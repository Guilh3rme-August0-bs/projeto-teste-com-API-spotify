import { Music4 } from "lucide-react"
import { formatarTempo } from "../../utils/timeFormatter"

export const MusicData = ({ data = [], cover = ''}) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-full min-h-55 w-full items-center justify-center rounded-3xl bg-bg-card">
                <Music4 className="h-16 w-16 sm:h-20 sm:w-20" />
            </div>
        )
    }

    console.log(data)

    if (data.plainLyrics || typeof data === "string") {
        return (
            <div className="flex h-[90vh] max-h-full flex-col gap-3 overflow-y-auto
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-track]:bg-slate-700
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-(--main-color)
                [&::-webkit-scrollbar-thumb:hover]:bg-[#1f8a38]">
                <p className="w-full text-sm leading-6 text-slate-200 lyricsText">
                    {data.plainLyrics || data}
                </p>
            </div>
        )
    }

    return (
        <div className="flex h-full min-h-55 w-full flex-col overflow-hidden rounded-3xl bg-card-color p-4 shadow-xl sm:p-6">
            <div className="mb-4 flex flex-col items-center gap-3 text-center sm:mb-6 sm:flex-row sm:items-center sm:gap-4 sm:text-left">
                <img
                    className="h-75 w-75 bg-slate-800 object-cover"
                    src={cover}
                    alt=""
                />

                <div className="min-w-0">
                    <h1 id="title-album" className="truncate text-lg font-semibold sm:text-xl">
                    </h1>
                    <p id="album-artist" className="mt-1 text-xs text-slate-400 sm:text-sm">
                        {data.artista}
                    </p>
                </div>
            </div>

            <div className="flex h-[43vh] max-h-full flex-col gap-3 overflow-y-auto pr-1
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-track]:bg-slate-700
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-(--main-color)
                [&::-webkit-scrollbar-thumb:hover]:bg-[#1f8a38]">

                {data.map((item, index) => (
                    <div key={index} className="track-time flex flex-row justify-between rounded-2xl border border-slate-700 bg-bg-card p-3 sm:p-4">
                        <p className="text-sm text-slate-300">{item.faixa}. {item.nome}</p>
                        <p className="text-sm text-slate-500">{formatarTempo(item.duracao)?.[0]}</p>
                    </div>
                ))}

            </div>
        </div>
    )
}