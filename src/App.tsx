import { useEffect, useState } from 'react'
import Select from 'react-select'
import axios from 'axios';

interface IStates {
  id: number;
  nome: string;
  sigla: string;
  regiao: {
    id: number;
    sigla: string;
    nome: string;
  }
}

interface ICity {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: IStates;
    }
  }
}

const App = () => {

  const [states, setStates] = useState<IStates[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const [state, setState] = useState<IStates | null>();
  const [city, setCity] = useState<ICity | null>();

  useEffect(() => {
    setState(null);
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
    }),

    placeholder: (provided: any) => ({
      ...provided,
      color: '#CCC',
      fontWeight: '500',
    }),

    singleValue: (provided: any) => ({
      ...provided,
      color: '#545454',
      fontWeight: '500',
    }),

    option: (provided: any, state: any) => ({
      ...provided,
      borderBottom: '1px solid #CCC',
      fontWeight: '500',
      color: state.isSelected ? 'white' : '#757575',
      padding: 15,
    }),
  }

  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center'>
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
            onChange={(value: any) => { setCity(value), console.log(value); }}
          />
        </div>
      </div>

      {city &&
        <div className='w-[40%] mt-[2rem] border p-4 rounded'>
          <h1 className='text-center font-bold text-[#575757] border-b pb-4'>
            {city.microrregiao.mesorregiao.UF.regiao.nome}
          </h1>
          <div className='text-center my-[1rem] text-[#4b4b4b]'>
            <span className=''>{city.microrregiao.mesorregiao.nome}</span> - <span>{city.microrregiao.mesorregiao.UF.regiao.nome}</span>
          </div>
        </div>
      }
    </div>
  )
}

export default App;