import React, {useEffect, useState} from "react";
import axios from "axios";
import './App.css'; 

type Person = any;
type Location = any;  

const SortingDirection = {
  ASCENDING : 'ASCENDING',
  DESCENDING : 'DESCENDING',
  UNSORTED : 'UNSORTED',

}

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

const flattenLocations = (locations: Location[]) => {
  const location = locations[0];
  // console.log(locations);
  const data = []
  for (const {street, coordinates, timezone, ...rest} of locations)
    data.push({
      ...rest,
      number: street.number,
      name: street.name,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    })

  const flattenedLocationHeaders = extractObjectKeys(data[0]);
  return { headers: flattenedLocationHeaders, data };
  // console.log(flattenedLocationHeaders)
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
};

const sortData = (data: any, sortKey: string, sortingDirection: SortingDirection) => {
data.sort((a: any, b: any) => {
  const relevantValueA = a[sortKey];
  const relevantValueB = b[sortKey];

  if (sortingDirection === SortingDirection.UNSORTED || sortingDirection === SortingDirection.ASCENDING) {
    if (relevantValueA < relevantValueB) return -1;
    if (relevantValueA > relevantValueB) return 1;
    return 0;
  } else {
    if (relevantValueA > relevantValueB) return -1;
    if (relevantValueA < relevantValueB) return 1;
    return 0;
  }
});
}

const getNextSortingDirection = (sortingDirection: SortingDirection) => {
  if (sortingDirection === SortingDirection.UNSORTED || sortingDirection === SortingDirection.ASCENDING) {
    return SortingDirection.DESCENDING;
}
return SortingDirection.ASCENDING;
}

function App() {
  const [people, setPeople] = useState([]);
  const [flattenedLocations, setFlattenedLocations] = useState({headers: [], data: []});
  const [sortingDirections, setSortingDirections] = useState({})

  const sortColumn = (sortKey) => {
    console.log(sortKey);
    const newFlattenedLocations = {
      ...flattenedLocations,
      data: [...flattenedLocations.data]
    };

    const currentSortingDirection = sortingDirections[sortKey];

    sortData(newFlattenedLocations.data, sortKey, currentSortingDirection);
    const nextSortingDirection = getNextSortingDirection(currentSortingDirection);
    
    const newSortingDirections = {...sortingDirections};
    newSortingDirections[sortKey] = nextSortingDirection;

    setFlattenedLocations(newFlattenedLocations);
    setSortingDirections(newSortingDirections);
  };

  useEffect(() => {
    fetchData().then(apiPeople => {
      setPeople(apiPeople);
      const ourFlattenedLocations = flattenLocations(
        apiPeople.map(({ location }) => location)
        );
      setFlattenedLocations(ourFlattenedLocations);
      const {headers} = ourFlattenedLocations;
      const ourSortingDirections = {};
      for (const header of headers) {
        ourSortingDirections[headers] = SortingDirection.UNSORTED;
      }
      setSortingDirections(ourSortingDirections);
    });
  }, [])
 
  return (
    <div className="App">
      <h1>Hello Manu!!</h1>
      <h2>Start editing to see some magic happen</h2>
      <table>
        <thead>
          <tr>
          {flattenedLocations.headers.map((locationString: string, locationIdx) => (
          <th 
          key={locationIdx} 
          onClick={() => {
            sortColumn(locationString);
          }}
          >
            {locationString}
            </th>
          ))}
          </tr>
        </thead>
        <tbody>
          {flattenedLocations.data.map((location: any, locationIdx) => (
            <tr key={locationIdx}>
              {flattenedLocations.headers.map((header, headerIdx) => (
                <td key={headerIdx}>{location[header]}</td>
              ))} 
            </tr>
          ))}
        </tbody>
      </table> 
      
    </div>
  );
}

export default App;
