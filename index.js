import {promises as fs, read} from 'fs';
import readline from 'readline';
const api = './api/states'


const stateInformation = []

const init = () => {
  writeStateFiles();
  //userInputState();
  //biggerStates();
  
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
    //biggerName(stateInformation)
    smallerName(stateInformation)
    //biggerStates(stateInformation);
    //smallerStates(stateInformation);
    
  } catch(err) {
    console.log(err)
  }
}
const filterState = (val, state) => { return val.Estado === state.ID }


const readInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const stateFilter = async (state) => {
  try {
    const readStateFile = await readFile((`${api}/${state}.json`))
    console.log(state, ' - ', readStateFile.cities.length)
  
    readInterface.close()
  } catch(err){
    console.log(err)
  }
}

const userInputState = () => {
  readInterface.question('Enter a state: ', input => {
    let inputState = input.toUpperCase()
    stateFilter(inputState)
  })
}

const biggerStates = (data) => {
  console.log(data.sort((x, y) => y.quantity - x.quantity).slice(0, 5))
}

const smallerStates = (data) => {
  console.log(data.sort((x, y) => x.quantity - y.quantity).slice(0, 5))
}

const biggerName = (data) => {
  data.forEach(async state => {
    try {
      const readCityName = await readFile(`${api}/${state.uf}.json`)
      let sortCities = (readCityName.cities).sort((x, y) => y.Nome.length - x.Nome.length).slice(0,1)
      let mapName = sortCities.map(city => city.Nome)
      console.log(`${mapName} - ${state.uf} `)
    } catch(err){
      console.log(err)
    }    
  })
}

const smallerName = (data) => {
  data.forEach(async state => {
    try {
      const readCityName = await readFile(`${api}/${state.uf}.json`)
      let sortCities = (readCityName.cities).sort((x, y) => x.Nome.length - y.Nome.length).slice(0,1)
      let mapName = sortCities.map(city => city.Nome)
      console.log(`${mapName} - ${state.uf} `)
    } catch(err){
      console.log(err)
    }    
  })
}


init();




