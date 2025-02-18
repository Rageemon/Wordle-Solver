import { Route,Routes } from "react-router-dom";
import Solver from "./pages/solver";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Solver/>} />
    </Routes>
  )
}

export default App
