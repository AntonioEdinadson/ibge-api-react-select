import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import axios from 'axios';

interface IStates {
  id: number;
  nome: string;
  sigla: string;
}

interface ICity {
  id: number;
  nome: string;
}

const App = () => {

  const [states, setStates] = useState<IStates[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const [state, setState] = useState<IStates | null>();
  const [city, setCity] = useState<ICity | null>();

  useEffect(() => {
    getData();
  }, [])

  useEffect(() => {
    setCity(null);
    getCities();
  }, [state])

  const getData = async () => {
    const uf = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
    setStates(uf.data);
  }

  const getCities = async () => {
    const city = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state?.sigla}/municipios`);
    setCities(city.data);
  }

  const updateNewStates = states.map(state => {
    return {
      label: `${state.sigla} - ${state.nome}`,
      value: state.sigla,
      ...state
    }
  });

  const upateNewCities = cities.map(city => {
    return {
      label: city.nome,
      value: city.id,
      ...city
    }
  });

  const customStylesSelect = {
    control: (provided: any) => ({
      ...provided,
      padding: 8,
      color: 'red'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      borderBottom: '1px solid #CCC',
      color: state.isSelected ? 'white' : '#757575',
      padding: 15,
    }),
  }

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <div className='w-[40%] bg-red flex gap-4'>

        <div className='w-[50%]'>
          <Select
            options={updateNewStates}
            value={state}
            styles={customStylesSelect}
            placeholder="Selecione uma opção"
            onChange={(value: any) => setState(value)}
          />
        </div>

        <div className='w-[50%]'>
          <Select
            options={upateNewCities}
            value={city}
            styles={customStylesSelect}
            isDisabled={cities.length > 0 ? false : true}
            placeholder="Selecione uma opção"
            onChange={(value: any) => setCity(value)}
          />
        </div>

      </div>
    </div>
  )
}

export default App
