import { useState } from 'react'
import './App.css'
import { SearchPage } from './components/pages/SearchPage'

function App() {
  return (
    <div className="flex min-h-screen flex-col gap-3 bg-(--bg-card) p-3 md:flex-row md:p-6">
      <aside className="flex w-full shrink-0 flex-row gap-2 rounded-xl bg-(--card-color) p-2 md:w-52 md:flex-col md:justify-start md:gap-3 md:p-3">
        <button className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-center text-sm font-medium text-white md:flex-none">
          Top Songs
        </button>
        <button className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-center text-sm font-medium text-white md:flex-none">
          Search
        </button>
      </aside>

      <main className="min-h-0 flex-1">
        <SearchPage />
      </main>
    </div>
  )
}

export default App
