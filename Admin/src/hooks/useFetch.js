import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const user=useContext(AuthContext)
   //const host="https://bookingo.herokuapp.com/api";
  const host="http://localhost:8800/api"
  if(url.charAt(0)!='/')url='/'+url;
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log(user.user);
      try {
        const res = await axios.get(host+url,{headers:{
          "access_token":user.user.access_token
        }});
        setData(res.data);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(host+url);
      setData(res.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  return { data, loading, error, reFetch };
};

export default useFetch;
