import React, {useEffect} from "react";
import axios from "axios";
import './App.css';

const fetchData = () => {
  return axios.get('https://randomuser.me/api/?results=20')
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  })
}

function App() {
  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className="App">
      <h1>Hello Manu!!</h1>
      <h2>Start editing to see some magic happen</h2>
    </div>
  );
}

export default App;
