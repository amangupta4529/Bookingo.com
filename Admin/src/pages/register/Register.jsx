import React, { useContext, useEffect } from 'react'
import Nav from '../../components/navbar2/Nav'
import "./register.css"
import lpy from "../../lpy.webp"
import Camera from '../../Assets/Camera'
import { useState } from 'react'
import axios from 'axios'
import {useNavigate} from "react-router-dom"
import { AuthContext }  from '../../context/AuthContext'



export default function Register() {
  const navigate=useNavigate();
  const [profile, setprofile] = useState("");
  const [profileurl, setprofileurl] = useState("");
  const {dispatch,loading}=useContext(AuthContext)
  const sampleUser={
            username: "",
            email:"",
            country:"",
            city:"",
            phone:"",
            img:"",
            password:""
          }
          const [user, setUser] = useState(sampleUser)
  const handleChange=(e)=>{
    const value=e.target.value;
    const name=e.target.id;
    setUser({...user,[name]:value});
  }
  const host="https://bookingo.herokuapp.com/api";
  
  const handleSubmit=async (e)=>{
    console.log(user);
    e.preventDefault();
    dispatch({ type: "LOADING_START"})
    console.log(loading);
    try {
      const url=await uploadPhoto();
      console.log(url);
      const newUser={...user,img:url,"isAdmin":true}
      console.log(newUser);
      try {
          const res=await axios.post(host+"/auth/register",newUser);
          navigate("/login")
      } catch (err) {
        alert("username or email already exist")
      }
    } catch (error) {
      alert(error)
    }finally{
      dispatch({ type: "LOADING END"})
    }
   
  }
  const uploadPhoto= async()=>{
    if(profile[0]){
      dispatch({ type: "LOADING_START"})
    const data = new FormData();
    data.append("file", profile[0]);
    data.append("upload_preset", "ncjn97qk");
    try {
      const res=await axios.post(
       "https://api.cloudinary.com/v1_1/dukysvygr/image/upload",
       data);
       const {url}=res.data;
       setprofileurl(url)
       return url;
    } catch (error) {
      dispatch({ type: "LOADING END"})
      alert(error)
    }
  }
      return "";
  }
  return (
    <div className='reg-cont'>
        <Nav type="login"/>
        <div className="container">
            <div className="left-side parts">
              <div className="imgleft">
                <img src={lpy} className='bookimg'></img>
              </div>
            </div>
           <div className='form-cont right-side parts'>
            <h2>Let's create an Admin account</h2>
        <form className='reg-form' onSubmit={handleSubmit}>
        <div className="profile">
                  <div className="profile-img-container">
                    <img id="profileImage" src={
                profile
                  ? URL.createObjectURL(profile[0])
                  : "https://i.ibb.co/MBtjqXQ/no-avatar.gif"
              }/>
                    <label htmlFor="profile-file" id="uploadBtn">
                      <Camera />
                    </label>
                  </div>
                  <input
                    type="file"
                    id="profile-file"
                    name="profile-photo"
                    placeholder="Profile"
                    accept="Image/"
                    onChange={(e)=>{
                      setprofile(e.target.files);
                    }}
                  />
                </div>
           <div className='form-box'>
              <div className="labels">
              <label htmlFor="name">Username</label>
                <label htmlFor="email">Email address</label>
                <label htmlFor="city">City</label>
                <label htmlFor="country">Country</label>
                <label htmlFor="phone">Phone</label>
                <label htmlFor="password">Password</label>
              </div>
              <div className="input-filed">
                <input required type="text" value={user.username} onChange={handleChange} placeholder='Enter User Name' id='username' className='reg-input'/>
                <input required type="text" value={user.email} onChange={handleChange} placeholder='Enter Your Password' id='email' className='reg-input'/>
                <input required type="text" value={user.city} onChange={handleChange} placeholder='Enter Your City' id='city' className='reg-input'/>
                <input required  type="text" value={user.country} onChange={handleChange}  placeholder='Enter User Country' id='country' className='reg-input'/>
                <input required type="tel"  value={user.phone} onChange={handleChange} placeholder='Enter User Phone' id='phone' className='reg-input'/>
                <input required type="password" value={user.password} onChange={handleChange}   name="password" placeholder='Enter Your Password ' className='reg-input' id="password" />
                </div>
            </div>
            <button type='submit' className='register-btn'>Register</button>
        </form>

        </div>
        
        </div>
        
    </div>
  )
}
