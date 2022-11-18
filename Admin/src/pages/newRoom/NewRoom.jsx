import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { roomInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {useNavigate} from "react-router-dom"
const NewRoom = () => {
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState(undefined);
  const [rooms, setRooms] = useState([]);
  const { data, loading, error } = useFetch("/hotels");
  const {dispatch,user}=useContext(AuthContext)
  const navigate=useNavigate();
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  // const host="https://bookingo.herokuapp.com/api";
  const host="http://localhost:8800/api";
  const handleClick = async (e) => {
    e.preventDefault();
    const roomNumbers = rooms.split(",").map((room) => ({ number: room }));
    
      if(hotelId==undefined)alert("select hotel again")
      else{
        try {
          dispatch({ type: "LOADING_START"})
          console.log(info);
      await axios.post(host+`/rooms/${hotelId}`, { ...info, roomNumbers,access_token:user.access_token});
      dispatch({ type: "LOADING END"})
      navigate("/rooms")
    } catch (err) {
      dispatch({ type: "LOADING END"})
      alert(err);
    }
  }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Room</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleClick}>
              {roomInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
              <div className="formInput">
                <label>Rooms</label>
                <textarea  required
                  onChange={(e) => setRooms(e.target.value)}
                  placeholder="give comma between room numbers."
                />
              </div>
              <div className="formInput">
                <label>Choose a hotel</label>
                <select
                  id="hotelId"
                  required
                  onChange={(e) => setHotelId(e.target.value)}
                >
                  {loading
                    ? "loading"
                    : data &&
                      data.map((hotel) => (
                        <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
                      ))}
                </select>
              </div>
              <button type="submit">submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;
