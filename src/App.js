import React, {useEffect, useState} from "react";
import axios from "axios";
import './App.css'; 

type Person = any;

const fetchData = () => {
  return axios.get('https://randomuser.me/api/?results=20')
  .then((res) => {
    const {results} = res.data;
    console.log(results);
    return results;
  })
  .catch((err) => {
    console.error(err);
  })
}

function App() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetchData().then(apiPeople => {
      setPeople(apiPeople);
    });
  }, [])

  return (
    <div className="App">
      <h1>Hello Manu!!</h1>
      <h2>Start editing to see some magic happen</h2>
      {people.map((person: Person, personIdx) => <div key={personIdx}>
        {person.name.first}
      </div>)}
    </div>
  );
}

export default App;
