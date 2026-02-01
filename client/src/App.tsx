import { Route, Routes } from "react-router-dom"
import { Chat } from "./pages/Chat"


function App() {

  return (
    <>
    <div className="w-full h-full my-20 flex flex-col items-start justify-center">
      <Routes>
        <Route path="/" element={<Chat />} />
      </Routes>
    </div>
    </>
  )
}

export default App
