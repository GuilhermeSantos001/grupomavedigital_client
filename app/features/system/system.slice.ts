/**
 * @description Reducer -> System
 * @author GuilhermeSantos001
 * @update 31/12/2021
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Status = 'available' | 'unavailable' | 'blocked'

// ? Dados do Centro de Custo
export type CostCenter = {
  id: string
  title: string // ? Nome do Centro de Custo
  status: Status // ? Status do Centro de Custo
  createdAt: string // ? Data de criação do Centro de Custo
  updatedAt: string // ? Data de atualização do Centro de Custo
}

// ? Dados das Pessoas
export type Person = {
  id: string
  matricule: number // ? Matrícula da pessoa
  name: string // ? Nome da pessoa
  cpf: string // ? CPF da pessoa
  rg: string // ? RG da pessoa
  motherName: string // ? Nome da mãe da pessoa
  birthDate: string // ? Data de nascimento da pessoa
  phone: string // ? Telefone da pessoa
  email: string // ? E-mail da pessoa
  address: { // ? Endereço da pessoa
    street: string // ? Rua da casa da pessoa
    number: number // ? Número da casa da pessoa
    complement: string // ? Complemento da casa da pessoa
    neighborhood: string // ? Bairro da casa da pessoa
    city: string // ? Cidade da casa da pessoa
    state: string // ? Estado da casa da pessoa
    zipCode: string // ? CEP da casa da pessoa
  }
  scale: Scale // ? Escala de trabalho da pessoa
  mirror: string // ? Espelho de ponto da pessoa
  workplace: Workplace // ? Local de trabalho da pessoa
  status: Status // ? Status do lote
  createdAt: string // ? Data de criação da pessoa
  updatedAt: string // ? Data de atualização da pessoa
}

// ? Dados dos Locais de Trabalho
export type Workplace = {
  id: string
  name: string // ? Nome do local de trabalho da pessoa
  scale: Scale // ? Escala do local de trabalho da pessoa
  services: Service[] // ? Serviços do local de trabalho da pessoa
  entryTime: string // ? Hora de entrada do local de trabalho da pessoa
  exitTime: string // ? Hora de saída do local de trabalho da pessoa
  address: { // ? Endereço do local de trabalho da pessoa
    street: Street // ? Rua do local de trabalho da pessoa
    number: number // ? Número da Casa do local de trabalho da pessoa
    complement: string // ? Complemento do local de trabalho da pessoa
    neighborhood: Neighborhood // ? Bairro do local de trabalho da pessoa
    city: City // ? Cidade do local de trabalho da pessoa
    district: District // ? Distrito do local de trabalho da pessoa
    zipCode: number // ? CEP do local de trabalho da pessoa
  }
}

// ? Dados dos Serviços
export type Service = {
  id: string
  value: string // ? Valor do serviço
  status: Status // ? Status do serviço
  createdAt: string // ? Data de criação do serviço
  updatedAt: string // ? Data de atualização do serviço
}

// ? Dados das Escalas de Trabalho
export type Scale = {
  id: string
  value: string // ? Valor da escala de trabalho
  status: Status // ? Status da escala de trabalho
  createdAt: string // ? Data de criação da escala de trabalho
  updatedAt: string // ? Data de atualização da escala de trabalho
}

// ? Dados das Ruas
export type Street = {
  id: string
  name: string // ? Nome da rua
  status: Status // ? Status da rua
  createdAt: string // ? Data de criação da rua
  updatedAt: string // ? Data de atualização da rua
}

// ? Dados dos Bairros
export type Neighborhood = {
  id: string
  name: string // ? Nome do bairro
  status: Status // ? Status do bairro
  createdAt: string // ? Data de criação do bairro
  updatedAt: string // ? Data de atualização do bairro
}

// ? Dados das Cidades
export type City = {
  id: string
  name: string // ? Nome da cidade
  status: Status // ? Status da cidade
  createdAt: string // ? Data de criação da cidade
  updatedAt: string // ? Data de atualização da cidade
}

// ? Dados dos Distritos (Estados)
export type District ={
  id: string
  name: string // ? Nome do distrito
  status: Status // ? Status do distrito
  createdAt: string // ? Data de criação do distrito
  updatedAt: string // ? Data de atualização do distrito
}

export interface PaybackState {
  costCenters: CostCenter[]
  people: Person[],
  workplaces: Workplace[],
  scales: Scale[],
  services: Service[],
  streets: Street[],
  neighborhoods: Neighborhood[],
  cities: City[],
  districts: District[],
}

const initialState: PaybackState = {
  costCenters: [],
  people: [],
  workplaces: [],
  scales: [],
  services: [],
  streets: [],
  neighborhoods: [],
  cities: [],
  districts: [],
};

export const reducerSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    // ? Usado para adicionar um novo centro de custo
    appendCostCenter: (state, action: PayloadAction<CostCenter>) => {
      if (!state.costCenters)
        state.costCenters = [];

      if (state.costCenters.filter(item => item.title === action.payload.title).length <= 0)
        state.costCenters.push(action.payload);
    },
    // ? Usado para editar um centro de custo
    editCostCenter: (state, action: PayloadAction<CostCenter>) => {
      if (!state.costCenters)
        state.costCenters = [];

      const index = state.costCenters.findIndex(item => item.id === action.payload.id);

      if (index !== -1 && state.costCenters.filter(item => item.title === action.payload.title).length <= 0)
        state.costCenters[index] = action.payload;
    },
    // ? Usado para remover um centro de custo
    removeCostCenter: (state, action: PayloadAction<string>) => {
      if (!state.costCenters)
        state.costCenters = [];

      state.costCenters = state.costCenters.filter(item => item.id !== action.payload);
    },
    // ? Usado para limpar os centros de custo
    clearCostCenters: (state) => {
      state.costCenters = [];
    },
    // ? Usado para adicionar uma nova pessoa
    appendPerson: (state, action: PayloadAction<Person>) => {
      if (!state.people)
        state.people = [];

      if (state.people.filter(item =>
        item.matricule === action.payload.matricule ||
        item.cpf === action.payload.cpf ||
        item.rg === action.payload.rg
      ).length <= 0)
        state.people.push(action.payload);
    },
    // ? Usado para editar uma pessoa
    editPerson: (state, action: PayloadAction<Person>) => {
      if (!state.people)
        state.people = [];

      const index = state.people.findIndex(item => item.id === action.payload.id);

      if (index !== -1)
        state.people[index] = action.payload;
    },
    // ? Usado para remover uma pessoa
    removePerson: (state, action: PayloadAction<string>) => {
      if (!state.people)
        state.people = [];

      state.people = state.people.filter(item => item.id !== action.payload);
    },
    // ? Usado para limpar as pessoas
    clearPeople: (state) => {
      state.people = [];
    },
    // ? Adiciona um novo local de trabalho
    appendWorkplace: (state, action: PayloadAction<Workplace>) => {
      if (!state.workplaces)
        state.workplaces = [];

      if (state.workplaces.filter(item =>
        item.name === action.payload.name &&
        item.scale.value === action.payload.scale.value
      ).length <= 0)
        state.workplaces.push(action.payload);
    },
    // ? Edita um local de trabalho
    editWorkplace: (state, action: PayloadAction<Workplace>) => {
      if (!state.workplaces)
        state.workplaces = [];

      const index = state.workplaces.findIndex(item => item.id === action.payload.id);

      if (index !== -1)
        state.workplaces[index] = action.payload;
    },
    // ? Remove um local de trabalho
    removeWorkplace: (state, action: PayloadAction<string>) => {
      if (!state.workplaces)
        state.workplaces = [];

      state.workplaces = state.workplaces.filter(item => item.id !== action.payload);
    },
    // ? Limpa os locais de trabalho
    clearWorkplaces: (state) => {
      state.workplaces = [];
    },
    // ? Adiciona uma nova escala de trabalho
    appendScale: (state, action: PayloadAction<Scale>) => {
      if (!state.scales)
        state.scales = [];

      if (state.scales.filter(item =>
        item.value === action.payload.value
      ).length <= 0)
        state.scales.push(action.payload);
    },
    // ? Edita uma escala de trabalho
    editScale: (state, action: PayloadAction<Scale>) => {
      if (!state.scales)
        state.scales = [];

      const index = state.scales.findIndex(item => item.id === action.payload.id);

      if (index !== -1)
        state.scales[index] = action.payload;
    },
    // ? Remove uma escala de trabalho
    removeScale: (state, action: PayloadAction<string>) => {
      if (!state.scales)
        state.scales = [];

      state.scales = state.scales.filter(item => item.id !== action.payload);
    },
    // ? Limpa as escalas de trabalho
    clearScales: (state) => {
      state.scales = [];
    },
    // ? Adiciona um novo serviço
    appendService: (state, action: PayloadAction<Service>) => {
      if (!state.services)
        state.services = [];

      if (state.services.filter(item =>
        item.value === action.payload.value
      ).length <= 0)
        state.services.push(action.payload);
    },
    // ? Edita um serviço
    editService: (state, action: PayloadAction<Service>) => {
      if (!state.services)
        state.services = [];

      const index = state.services.findIndex(item => item.id === action.payload.id);

      if (index !== -1)
        state.services[index] = action.payload;
    },
    // ? Remove um serviço
    removeService: (state, action: PayloadAction<string>) => {
      if (!state.services)
        state.services = [];

      state.services = state.services.filter(item => item.id !== action.payload);
    },
    // ? Limpa os serviços
    clearServices: (state) => {
      state.services = [];
    },
    // ? Adiciona uma nova rua
    appendStreet: (state, action: PayloadAction<Street>) => {
      if (!state.streets)
        state.streets = [];

      if (state.streets.filter(item =>
        item.name === action.payload.name
      ).length <= 0)
        state.streets.push(action.payload);
    },
    // ? Edita uma rua
    editStreet: (state, action: PayloadAction<Street>) => {
      if (!state.streets)
        state.streets = [];

      const index = state.streets.findIndex(item => item.id === action.payload.id);

      if (index !== -1)
        state.streets[index] = action.payload;
    },
    // ? Remove uma rua
    removeStreet: (state, action: PayloadAction<string>) => {
      if (!state.streets)
        state.streets = [];

      state.streets = state.streets.filter(item => item.id !== action.payload);
    },
    // ? Limpa as ruas
    clearStreets: (state) => {
      state.streets = [];
    },
    // ? Adiciona um novo bairro
    appendNeighborhood: (state, action: PayloadAction<Neighborhood>) => {
      if (!state.neighborhoods)
        state.neighborhoods = [];

      if (state.neighborhoods.filter(item =>
        item.name === action.payload.name
      ).length <= 0)
        state.neighborhoods.push(action.payload);
    },
    // ? Edita um bairro
    editNeighborhood: (state, action: PayloadAction<Neighborhood>) => {
      if (!state.neighborhoods)
        state.neighborhoods = [];

      const index = state.neighborhoods.findIndex(item => item.id === action.payload.id);

      if (index !== -1)
        state.neighborhoods[index] = action.payload;
    },
    // ? Remove um bairro
    removeNeighborhood: (state, action: PayloadAction<string>) => {
      if (!state.neighborhoods)
        state.neighborhoods = [];

      state.neighborhoods = state.neighborhoods.filter(item => item.id !== action.payload);
    },
    // ? Limpa os bairros
    clearNeighborhoods: (state) => {
      state.neighborhoods = [];
    },
    // ? Adiciona uma nova cidade
    appendCity: (state, action: PayloadAction<City>) => {
      if (!state.cities)
        state.cities = [];

      if (state.cities.filter(item =>
        item.name === action.payload.name
      ).length <= 0)
        state.cities.push(action.payload);
    },
    // ? Edita uma cidade
    editCity: (state, action: PayloadAction<City>) => {
      if (!state.cities)
        state.cities = [];

      const index = state.cities.findIndex(item => item.id === action.payload.id);

      if (index !== -1)
        state.cities[index] = action.payload;
    },
    // ? Remove uma cidade
    removeCity: (state, action: PayloadAction<string>) => {
      if (!state.cities)
        state.cities = [];

      state.cities = state.cities.filter(item => item.id !== action.payload);
    },
    // ? Limpa as cidades
    clearCities: (state) => {
      state.cities = [];
    },
    // ? Adiciona um novo distrito
    appendDistrict: (state, action: PayloadAction<District>) => {
      if (!state.districts)
        state.districts = [];

      if (state.districts.filter(item =>
        item.name === action.payload.name
      ).length <= 0)
        state.districts.push(action.payload);
    },
    // ? Edita um distrito
    editDistrict: (state, action: PayloadAction<District>) => {
      if (!state.districts)
        state.districts = [];

      const index = state.districts.findIndex(item => item.id === action.payload.id);

      if (index !== -1)
        state.districts[index] = action.payload;
    },
    // ? Remove um distrito
    removeDistrict: (state, action: PayloadAction<string>) => {
      if (!state.districts)
        state.districts = [];

      state.districts = state.districts.filter(item => item.id !== action.payload);
    },
    // ? Limpa os distritos
    clearDistricts: (state) => {
      state.districts = [];
    }
  }
})

export const {
  appendCostCenter,
  editCostCenter,
  removeCostCenter,
  clearCostCenters,
  appendPerson,
  editPerson,
  removePerson,
  clearPeople,
  appendWorkplace,
  editWorkplace,
  removeWorkplace,
  clearWorkplaces,
  appendScale,
  editScale,
  removeScale,
  clearScales,
  appendService,
  editService,
  removeService,
  clearServices,
  appendStreet,
  editStreet,
  removeStreet,
  clearStreets,
  appendNeighborhood,
  editNeighborhood,
  removeNeighborhood,
  clearNeighborhoods,
  appendCity,
  editCity,
  removeCity,
  clearCities,
  appendDistrict,
  editDistrict,
  removeDistrict,
  clearDistricts,
} = reducerSlice.actions

export default reducerSlice.reducer