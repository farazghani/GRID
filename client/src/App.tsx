import { Routes , Route } from "react-router-dom";
import Gamepage from "./pages/Gamepage";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
export default function App() {

  return (
   <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/game" element={<Gamepage />} />
    <Route path="/login"  element={< Signup/>} />
   </Routes>
  );
}
