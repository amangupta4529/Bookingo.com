import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import "./App.css"
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import {SyncLoader} from "react-spinners"
import {AuthContext}  from "./context/AuthContext"
import { useContext } from "react";
function App() {
  const {loading} = useContext(AuthContext)
  return (
    <div className="mainscreen">
        {loading && <div className="loading">
              <SyncLoader size={20}/>
        </div>}
           <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/hotels" element={<List/>}/>
        <Route path="/hotels/:id" element={<Hotel/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </BrowserRouter>

    </div>
    
  );
}

export default App;
