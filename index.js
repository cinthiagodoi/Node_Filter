import {promises as fs, read} from 'fs';
import readline from 'readline';
const api = './api/states'


const stateInformation = []
const bigestCities = []
const smallerCities = []

const init = () => {
  writeStateFiles();
  userInputState();
}

const readFile = async (file) => JSON.parse(await fs.readFile(file));

const writeStateFiles = async () => {
  try {
    const states = await readFile(`api/States.json`);
    const cities = await readFile(`api/Cities.json`);
    
    for(const state of states) {
      const data = { cities: [] };
      for(const city of cities.filter((v) => filterState(v, state))) { data.cities.push(city) }

      let statesData = {
        uf: state.Sigla,
        quantity: data.cities.length,
      }
      stateInformation.push(statesData)
      await fs.writeFile(`api/states/${state.Sigla}.json`, JSON.stringify(data));
    }
  } catch(err) {
    console.log(err)
  }
  biggerCityName(stateInformation);
  smallerCityName(stateInformation);
  biggerStates(stateInformation);
  smallerStates(stateInformation);
}

const filterState = (val, state) => { return val.Estado === state.ID }

const readInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const stateFilter = async (state) => {
  try {
    const readStateFile = await readFile((`${api}/${state}.json`));
    console.log(state, ' - ', readStateFile.cities.length);
  
    readInterface.close();
  } catch(err){
    console.log(err);
  };
};

const userInputState = () => {
  readInterface.question('Enter a state: ', input => {
    let inputState = input.toUpperCase();
    stateFilter(inputState);
  });
};

const biggerStates = (data) => {
  console.log(data.sort((x, y) => y.quantity - x.quantity).slice(0, 5))
};

const smallerStates = (data) => {
  console.log(data.sort((x, y) => x.quantity - y.quantity).slice(0, 5))
};

const biggerCityName = async (states) => {
  try{
    for(const state of states) {
      const readCitiesFile = await readFile(`${api}/${state.uf}.json`);
      const sortCity = (readCitiesFile.cities).sort((x, y) => y.Nome.length - x.Nome.length).slice(0, 1);
      sortCity.map(city => {
        let result = {
          name: city.Nome,
          uf: state.uf
        }
        bigestCities.push(result)
        return result
      });
    }
  }catch(err){console.log(err)}
  console.log(bigestCities)
  bigName(bigestCities)
}

const smallerCityName = async (states) => {
  try{
    for(const state of states) {
      const readCitiesFile = await readFile(`${api}/${state.uf}.json`);
      let alphabeticalOrder = ((readCitiesFile.cities).sort((a, b) => {
        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
      }));
   
      const sortCity = (alphabeticalOrder.sort((x, y) => x.Nome.length - y.Nome.length).slice(0, 1))
      sortCity.map(city => {
        let result = {
          name: city.Nome,
          uf: state.uf
        };
        smallerCities.push(result)
        return result
      });
    }
  }catch(err){console.log(err)}
  console.log(smallerCities)
  smallName(smallerCities)
}

const smallName = (smallerCities) => {
  
  let alphabeticalOrder = (smallerCities.sort((a, b) => {
    return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
  }));
  console.log(alphabeticalOrder.sort((x, y) => x.name.length - y.name.length).slice(0,1))
}

const bigName = (bigestCities) => {
  let alphabeticalOrder = (bigestCities.sort((a, b) => {
    return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
  }));
  console.log(alphabeticalOrder.sort((x, y) => y.name.length - x.name.length).slice(0,1))
}

init();




