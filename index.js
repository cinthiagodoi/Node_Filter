import {promises as fs, read} from 'fs';
import readline from 'readline';
const api = './api/states'

const init = () => {
  writeStateFiles();
  //userInputState();
  biggerStates();
}

const readFile = async (file) => JSON.parse(await fs.readFile(file));

const writeStateFiles = async () => {
  try {
    const states = await readFile(`api/States.json`);
    const cities = await readFile(`api/Cities.json`);
    
    for(const state of states) {
      const data = { cities: [] };
      for(const city of cities.filter((v) => filterState(v, state))) { data.cities.push(city) }
      await fs.writeFile(`api/states/${state.Sigla}.json`, JSON.stringify(data));
    }
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

const biggerStates = async () => {
  try{
    const states = await readFile(`./api/States.json`);
    let searchStates = await Promise.all(states.map( async state => {
      const readCitiesSize = await readFile(`${api}/${state.Sigla}.json`)
      let uf = state.Sigla;
      let quantity = readCitiesSize.cities.length;
      
      return {uf: uf, quantity: quantity}
    }))
    console.log(searchStates.sort((x, y) => y.quantity - x.quantity).slice(0, 5))
    console.log(searchStates.sort((x, y) => x.quantity - y.quantity).slice(0, 5))
  }catch(err) {
    console.log(err)
  }
}

const biggerCityName = async () => {
  try {

  }catch(err) {
    console.log(err)
  }
}





init();




