import { Music4 } from "lucide-react"

export const MusicData = ({ data, type }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-full min-h-55 w-full items-center justify-center rounded-3xl bg-bg-card">
                <Music4 className="h-16 w-16 sm:h-20 sm:w-20" />
            </div>
        )
    }

    if (type === 'track') {
        return (
            <div className="flex h-full min-h-55 w-full overflow-hidden rounded-3xl bg-bg-card p-4 sm:p-5">
                <p className="w-full text-sm leading-6 text-slate-200 lyricsText">
                    {/* conteúdo da letra */}
                </p>
            </div>
        )
    }

    return (
        <div className="flex h-full min-h-55 w-full flex-col overflow-hidden rounded-3xl bg-card-color p-4 shadow-xl sm:p-6">
            <div className="mb-4 flex flex-col items-center gap-3 text-center sm:mb-6 sm:flex-row sm:items-center sm:gap-4 sm:text-left">
                <img
                    className="h-20 w-20 rounded-3xl bg-slate-800 object-cover"
                    alt=""
                />

                <div className="min-w-0">
                    <h1 id="title-album" className="truncate text-lg font-semibold sm:text-xl">
                        {/* nome do álbum */}
                    </h1>
                    <p id="album-artist" className="mt-1 text-xs text-slate-400 sm:text-sm">
                        {/* artista */}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="track-time rounded-2xl border border-slate-700 bg-bg-card p-3 sm:p-4">
                    {/* faixa */}
                </div>
            </div>
        </div>
    )
}