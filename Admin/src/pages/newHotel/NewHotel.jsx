import "./newHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useContext, useState } from "react";
import { hotelInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Selectbox from "../../components/select box/Selectbox";
import React from 'react'
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
const NewHotel = () => {
  const theme = useTheme();
  const [files, setFiles] = useState("");
  const [info, setInfo] = useState({});
  const [rooms, setRooms] = useState([]);
  const [type, settype] = useState("");
  const [featured, setfeatured] = useState("")
  const {dispatch , user} =useContext(AuthContext)
  const navigate=useNavigate();
  const { data, loading, error } = useFetch("/rooms");

  // const host="https://bookingo.herokuapp.com/api";
  const host="http://localhost:8800/api";
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.id=='city' ? e.target.value.toUpperCase() : e.target.value }));
    console.log(info);
  };
  const handleSelect = (event) => {
    const {
      target: { value },
    } = event;
    setRooms(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );

    // const values = Array.from(
    //   event.target.selectedOptions,
    //   (option) => option.value
    // );
    console.log(rooms);
    // setRooms(values);
  };
  function getStyles(name, rooms, theme) {
    return {
      fontWeight:
        rooms.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  const handleType=(e)=>{
    settype(e.target.value)
    console.log(type);
  }
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 0;
const MenuProps = {
PaperProps: {
style: {
  maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
  width: 250,
},
},
};
//   <select id="type" onChange={handleChange}>
//   <option key="hotel-type" value="hotel">
//   Hotel
//   </option>
//   <option key="apartment-type" value="apartment">
//   Apartment
//   </option>
//   <option key="villa-type" value="villa">
//   Villa
//   </option>
// <option key="resort-type" value="resort">
//   Resort
//   </option>
//   <option key="canin-type" value="cabin">
//   Cabin
//   </option>
// </select>
  const propertyTypes=[
    {
    key:"hotel-type",
    value:"hotel",
    placeholder:"Hotel"
    },
    {
      key:"villa-type",
      value:"Villa",
      placeholder:"Villa"
      },
      {
        key:"apartment-type",
        value:"apartment",
        placeholder:"Apartment"
        },
        {
          key:"cabin-type",
          value:"cabin",
          placeholder:"Cabin"
          },
          {
            key:"resort-type",
            value:"resort",
            placeholder:"Resort"
            }
  ]
  
  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({type:"LOADING_START"});
    try {
      console.log(loading);
      const list = await Promise.all(
        Object.values(files).map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "ncjn97qk");
          const uploadRes = await axios.post(
            "https://api.cloudinary.com/v1_1/dukysvygr/image/upload",
            data
          );
          const { url } = uploadRes.data;
          navigate("/hotels")
          dispatch({type:"LOADING END"});
          return url;
        })
      );
        const newhotel = {
        ...info,
        "type":type,
        "featured":featured,
        rooms,
        photos: list,
      };

      await axios.post(host+"/hotels", newhotel,{headers:{
        "access_token":user.access_token
      }});
    } catch (err) {console.log(err)}
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Property</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                files
                  ? URL.createObjectURL(files[0])
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleClick}> 
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={(e) => e.target.files[0] && setFiles(e.target.files)}
                  style={{ display: "none" }}
                />
              </div>
              {hotelInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    required
                  />
                </div>
              ))}
              
               <div className="formInput">
              <label>Featured</label>
              <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Featured</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="featured"
                  value={featured}
                  label="Featured"
                  onChange={(e)=>setfeatured(e.target.value)}
                >
                  <MenuItem value={false}>No</MenuItem>
                  <MenuItem value={true}>Yes</MenuItem>
                </Select>
              </FormControl>
            </Box>
              </div>


              <div className="formInput">
              <label>Property Type</label>
              <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Property Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={type}
                  label="Type"
                  onChange={handleType}
                >
                  <MenuItem value="hotel">Hotel</MenuItem>
                  <MenuItem value="villa">Villa</MenuItem>
                  <MenuItem value="cabin">Cabin</MenuItem>
                  <MenuItem value="apartment">Apartment</MenuItem>
                  <MenuItem value="resort">Resort</MenuItem>
                </Select>
              </FormControl>
            </Box>
              </div>
              <div className="selectRooms">
                <label>Rooms</label>
                <div>
                  
                <FormControl sx={{  width: 300 }}>
                <InputLabel id="demo-multiple-name-label">Name</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id={"demo-multiple-name"}
                  multiple
                  value={rooms}
                  onChange={handleSelect}
                  input={<OutlinedInput label="Name" />}
                  MenuProps={MenuProps}
                >
                  {data.map((name) => (
                    <MenuItem
                      key={name._id}
                      value={name._id}
                      style={getStyles(name.value, rooms, theme)}
                    >
                      {name.title}
                    </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      </div>
              </div>
              <button type="submit" onSubmit={handleClick}>submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHotel;
