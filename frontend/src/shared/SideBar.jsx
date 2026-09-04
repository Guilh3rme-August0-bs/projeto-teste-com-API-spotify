import { useNavigate } from "react-router-dom"
import { LucideClock } from "lucide-react"
import { LucideSearch } from "lucide-react"

export const SideBar = () => {
    
const navigate = useNavigate()

    return (
        <aside className="flex w-full shrink-0 flex-row gap-2 rounded-xl bg-(--card-color) p-2 md:w-52 md:flex-col md:justify-start md:gap-3 md:p-3">
            <button className="flex-1 flex flex-row items-center gap-10 rounded-lg bg-white/5 px-3 py-2 text-center text-sm font-medium text-white md:flex-none"
            onClick={() => void navigate('/history')}>
                <LucideClock></LucideClock>
                History
            </button>
            <button className="flex-1 flex flex-row items-center gap-10 rounded-lg bg-white/5 px-3 py-2 text-center text-sm font-medium text-white md:flex-none"
            onClick={() => void navigate('/')}>
                <LucideSearch></LucideSearch>
                Search
            </button>
        </aside>
    )
}