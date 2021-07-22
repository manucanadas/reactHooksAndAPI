import React, {useEffect, useState} from "react";
import axios from "axios";
import './App.css'; 

type Person = any;
type Location = any;  

const fetchData = () => {
  return axios.get('https://randomuser.me/api/?results=20')
  .then((res) => {
    const {results} = res.data;
    // console.log(results);
    return results;
  })
  .catch((err) => {
    console.error(err);
  })
}

const flattenLocations = (locations:Location[]) => {
  const location = locations[0];
  console.log(locations);
  const flattenedLocationHeaders = extractObjectKeys(location);
  
  

  console.log(flattenedLocationHeaders)
}

const extractObjectKeys = (object: any) => {
  let objectKeys: string[] = [];

  Object.keys(object).forEach(objectKey => {
    const value = object[objectKey];
    if (typeof value !== 'object') {
      objectKeys.push(objectKey);
    } else {
      objectKeys = [...objectKeys, ...extractObjectKeys(value)];
    }
})

return objectKeys;
}

function App() {
  const [people, setPeople] = useState([]);
  const [flattenedLocations, setFlattenedLocations] = useState([]);

  useEffect(() => {
    fetchData().then(apiPeople => {
      setPeople(apiPeople);
      setFlattenedLocations(
        flattenLocations(apiPeople.map(({ location }) => location))
      );
    });
  }, [])

  return (
    <div className="App">
      <h1>Hello Manu!!</h1>
      <h2>Start editing to see some magic happen</h2>
      {people.map((person: Person, personIdx) => (
      <div key={personIdx}>{person.name.first}</div>
      ))}
    </div>
  );
}

export default App;
