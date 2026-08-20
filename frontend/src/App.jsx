import './App.css'
import { RouterProvider } from 'react-router-dom'
import { router } from '../src/router'


function App() {
  return (
    <main className="min-h-0 flex-1">
      <div className="flex min-h-screen flex-col gap-3 bg-(--bg-card) p-3 md:flex-row md:p-6">

        <RouterProvider router={router} />
    </div >
    </main>
  )
}

export default App
