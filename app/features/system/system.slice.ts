/**
 * @description Reducer -> System
 * @author GuilhermeSantos001
 * @update 18/01/2022
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Status = 'available' | 'unavailable' | 'blocked'

// ? Dados do Centro de Custo
export type CostCenter = {
  id: string
  title: string // ? Nome do Centro de Custo
}

// ? Dados dos Endereços
export type Address = {
  street: string // ? Rua do endereço
  number: number // ? Número do endereço
  complement: string // ? Complemento do endereço
  neighborhood: string // ? Bairro do endereço
  city: string // ? Cidade do endereço
  district: string // ? Estado do endereço
  zipCode: number // ? CEP do endereço
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
  mail: string // ? E-mail da pessoa
  address: Address // ? Endereço da pessoa
  scale: string // ? Escala de trabalho da pessoa
  services: string[] // ? Serviço da pessoa
  cards: string[] // ? Lista de cartões da pessoa
  status: Status // ? Status da pessoa
}

export type PersonCreate = Omit<Person, 'status'>

// ? Dados dos Locais de Trabalho
export type Workplace = {
  id: string
  name: string // ? Nome do local de trabalho da pessoa
  scale: string // ? Escala do local de trabalho da pessoa
  services: string[] // ? Serviços do local de trabalho da pessoa
  entryTime: string // ? Hora de entrada do local de trabalho da pessoa
  exitTime: string // ? Hora de saída do local de trabalho da pessoa
  address: Address // ? Endereço do local de trabalho da pessoa
}

// ? Dados dos Serviços
export type Service = {
  id: string
  value: string // ? Valor do serviço
}

// ? Dados das Escalas de Trabalho
export type Scale = {
  id: string
  value: string // ? Valor da escala de trabalho
}

// ? Dados dos motivos de falta
export type ReasonForAbsence = {
  id: string
  value: string // ? Valor do Motivo de falta do funcionário
}

// ? Dados das Ruas
export type Street = {
  id: string
  name: string // ? Nome da rua
}

// ? Dados dos Bairros
export type Neighborhood = {
  id: string
  name: string // ? Nome do bairro
}

// ? Dados das Cidades
export type City = {
  id: string
  name: string // ? Nome da cidade
}

// ? Dados dos Distritos (Estados)
export type District = {
  id: string
  name: string // ? Nome do distrito
}

// ? Dados dos Uploads
export type Upload = {
  fileId: string
  authorId: string
  filename: string
  filetype: string
  description: string
  size: number
  compressedSize: number
  version: number
  temporary: boolean
  expiredAt: string
  createdAt: string
}

export interface PaybackState {
  costCenters: CostCenter[]
  people: Person[],
  workplaces: Workplace[],
  scales: Scale[],
  reasonForAbsences: ReasonForAbsence[],
  services: Service[],
  streets: Street[],
  neighborhoods: Neighborhood[],
  cities: City[],
  districts: District[],
  uploads: Upload[]
}

const initialState: PaybackState = {
  costCenters: [],
  people: [],
  workplaces: [],
  scales: [],
  reasonForAbsences: [],
  services: [],
  streets: [],
  neighborhoods: [],
  cities: [],
  districts: [],
  uploads: []
};

export const slice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    CREATE_COSTCENTER: (state, action: PayloadAction<CostCenter>) => {
      if (!state.costCenters)
        state.costCenters = [];

      if (
        action.payload.id.length > 0 ||
        action.payload.title.length > 0
      ) {
        if (state.costCenters.filter(item => item.title === action.payload.title).length <= 0)
          state.costCenters.push(action.payload);
        else
          throw new Error(`Centro de custo com o ID ${action.payload.id} já existe!`);
      } else {
        throw new Error(`O ID e o nome do Centro de Custo não podem ser vazios!`);
      }
    },
    UPDATE_COSTCENTER: (state, action: PayloadAction<CostCenter>) => {
      if (!state.costCenters)
        state.costCenters = [];

      if (
        action.payload.id.length > 0 ||
        action.payload.title.length > 0
      ) {
        if (state.costCenters.filter(item => item.title === action.payload.title).length > 0)
          throw new Error(`Já existe um centro de custo com esse nome.`);

        const index = state.costCenters.findIndex(item => item.id === action.payload.id);

        if (index !== -1)
          state.costCenters[index] = action.payload;
        else
          throw new Error(`Centro de custo com o ID ${action.payload.id} não existe!`);
      } else {
        throw new Error(`O ID e o nome do Centro de Custo não podem ser vazios!`);
      }
    },
    DELETE_COSTCENTER: (state, action: PayloadAction<string>) => {
      if (!state.costCenters)
        state.costCenters = [];

      const index = state.costCenters.findIndex(item => item.id === action.payload);

      if (index !== -1)
        state.costCenters = state.costCenters.filter(item => item.id !== action.payload);
      else
        throw new Error(`Centro de custo com o ID ${action.payload} não existe!`);
    },
    CLEAR_COSTCENTERS: (state) => {
      state.costCenters = [];
    },
    CREATE_PERSON: {
      reducer: (state, action: PayloadAction<Person>) => {
        if (!state.people)
          state.people = [];

        if (
          action.payload.name.length > 0 &&
          action.payload.matricule > 0 &&
          action.payload.cpf.length > 0 &&
          action.payload.rg.length > 0 &&
          action.payload.motherName.length > 0 &&
          action.payload.birthDate != null &&
          action.payload.phone.length > 0 &&
          action.payload.mail.length > 0 &&
          action.payload.scale.length > 0 &&
          action.payload.services.length > 0 &&
          action.payload.address.street.length > 0 &&
          action.payload.address.number > 0 &&
          // ! Complemento não é obrigatório
          // ! action.payload.address.complement.length > 0 &&
          action.payload.address.neighborhood.length > 0 &&
          action.payload.address.city.length > 0 &&
          action.payload.address.district.length > 0 &&
          action.payload.address.zipCode > 0
        ) {
          if (state.people.filter(item =>
            item.matricule === action.payload.matricule ||
            item.cpf === action.payload.cpf ||
            item.rg === action.payload.rg
          ).length <= 0)
            state.people.push(action.payload);
          else
            throw new Error(`Já existe uma pessoa com essa matrícula, CPF ou RG.`);
        } else {
          throw new Error(`Não é possível criar a pessoa. Existem campos obrigatórios em branco.`);
        }
      },
      prepare: (item: PersonCreate) => {
        const
          status: Status = 'available';

        return {
          payload: {
            ...item,
            status
          }
        }
      }
    },
    UPDATE_PERSON: (state, action: PayloadAction<Person>) => {
      if (!state.people)
        state.people = [];

      if (
        action.payload.name.length > 0 &&
        action.payload.matricule > 0 &&
        action.payload.cpf.length > 0 &&
        action.payload.rg.length > 0 &&
        action.payload.motherName.length > 0 &&
        action.payload.birthDate != null &&
        action.payload.phone.length > 0 &&
        action.payload.mail.length > 0 &&
        action.payload.scale.length > 0 &&
        action.payload.services.length > 0 &&
        action.payload.address.street.length > 0 &&
        action.payload.address.number > 0 &&
        // ! Complemento não é obrigatório
        // ! action.payload.address.complement.length > 0 &&
        action.payload.address.neighborhood.length > 0 &&
        action.payload.address.city.length > 0 &&
        action.payload.address.district.length > 0 &&
        action.payload.address.zipCode > 0
      ) {
        if (state.people.filter(person =>
          person.id !== action.payload.id && person.matricule === action.payload.matricule ||
          person.id !== action.payload.id && person.cpf === action.payload.cpf ||
          person.id !== action.payload.id && person.rg === action.payload.rg
        ).length > 0)
          throw new Error(`Já existe uma pessoa com essa matrícula, CPF ou RG.`);

        const index = state.people.findIndex(item => item.id === action.payload.id);

        if (index !== -1)
          state.people[index] = action.payload;
        else
          throw new Error(`Pessoa com o ID ${action.payload.id} não existe!`);
      } else {
        throw new Error(`Não é possível atualizar a pessoa com o ID ${action.payload.id}. Existem campos obrigatórios em branco.`);
      }
    },
    DELETE_PERSON: (state, action: PayloadAction<string>) => {
      if (!state.people)
        state.people = [];

      const index = state.people.findIndex(item => item.id === action.payload);

      if (index !== -1)
        state.people = state.people.filter(item => item.id !== action.payload);
      else
        throw new Error(`Pessoa com o ID ${action.payload} não existe!`);
    },
    CLEAR_PEOPLE: (state) => {
      state.people = [];
    },
    CREATE_WORKPLACE: (state, action: PayloadAction<Workplace>) => {
      if (!state.workplaces)
        state.workplaces = [];

      if (
        action.payload.name.length > 0 &&
        action.payload.scale.length > 0 &&
        action.payload.entryTime !== null &&
        action.payload.exitTime !== null &&
        action.payload.services.length > 0 &&
        action.payload.address.street.length > 0 &&
        action.payload.address.number > 0 &&
        // ! Complemento não é obrigatório
        // ! action.payload.address.complement.length > 0 &&
        action.payload.address.neighborhood.length > 0 &&
        action.payload.address.city.length > 0 &&
        action.payload.address.district.length > 0 &&
        action.payload.address.zipCode > 0
      ) {
        if (state.workplaces.filter(item =>
          item.name === action.payload.name &&
          item.scale === action.payload.scale
        ).length <= 0)
          state.workplaces.push(action.payload);
        else
          throw new Error(`Já existe um local de trabalho com esse nome e escala.`);
      } else {
        throw new Error(`Não é possível criar o local de trabalho. Existem campos obrigatórios em branco.`);
      }
    },
    UPDATE_WORKPLACE: (state, action: PayloadAction<Workplace>) => {
      if (!state.workplaces)
        state.workplaces = [];

      if (
        action.payload.name.length > 0 &&
        action.payload.scale.length > 0 &&
        action.payload.entryTime !== null &&
        action.payload.exitTime !== null &&
        action.payload.services.length > 0 &&
        action.payload.address.street.length > 0 &&
        action.payload.address.number > 0 &&
        // ! Complemento não é obrigatório
        // ! action.payload.address.complement.length > 0 &&
        action.payload.address.neighborhood.length > 0 &&
        action.payload.address.city.length > 0 &&
        action.payload.address.district.length > 0 &&
        action.payload.address.zipCode > 0
      ) {
        if (
          state.workplaces.filter(place =>
            place.id !== action.payload.id && place.name === action.payload.name &&
            place.scale === action.payload.scale
          ).length > 0
        )
          throw new Error(`Já existe um local de trabalho com esse nome e escala.`);

        const index = state.workplaces.findIndex(item => item.id === action.payload.id);

        if (index !== -1)
          state.workplaces[index] = action.payload;
        else
          throw new Error(`Local de trabalho com o ID ${action.payload.id} não existe!`);
      } else {
        throw new Error(`Não é possível atualizar o local de trabalho. Existem campos obrigatórios em branco.`);
      }
    },
    DELETE_WORKPLACE: (state, action: PayloadAction<string>) => {
      if (!state.workplaces)
        state.workplaces = [];

      const index = state.workplaces.findIndex(item => item.id === action.payload);

      if (index !== -1)
        state.workplaces = state.workplaces.filter(item => item.id !== action.payload);
      else
        throw new Error(`Local de trabalho com o ID ${action.payload} não existe!`);
    },
    CLEAR_WORKPLACES: (state) => {
      state.workplaces = [];
    },
    CREATE_SCALE: (state, action: PayloadAction<Scale>) => {
      if (!state.scales)
        state.scales = [];

      if (
        action.payload.id.length > 0 &&
        action.payload.value.length > 0
      ) {
        if (state.scales.filter(item =>
          item.value === action.payload.value
        ).length <= 0)
          state.scales.push(action.payload);
        else
          throw new Error(`Já existe uma escala com esse valor.`);
      } else {
        throw new Error(`Não é possível criar a escala. Existem campos obrigatórios em branco.`);
      }
    },
    UPDATE_SCALE: (state, action: PayloadAction<Scale>) => {
      if (!state.scales)
        state.scales = [];

      if (
        action.payload.id.length > 0 &&
        action.payload.value.length > 0
      ) {
        if (
          state.scales.filter(scale =>
            scale.id !== action.payload.id && scale.value === action.payload.value
          ).length > 0
        )
          throw new Error(`Já existe uma escala com esse valor.`);

        const index = state.scales.findIndex(item => item.id === action.payload.id);

        if (index !== -1)
          state.scales[index] = action.payload;
        else
          throw new Error(`Escala com o ID ${action.payload.id} não existe!`);
      } else {
        throw new Error(`Não é possível atualizar a escala. Existem campos obrigatórios em branco.`);
      }
    },
    DELETE_SCALE: (state, action: PayloadAction<string>) => {
      if (!state.scales)
        state.scales = [];

      if (
        state.workplaces.filter(place =>
          place.scale === action.payload
        ).length > 0 ||
        state.people.filter(person =>
          person.scale === action.payload
        ).length > 0
      )
        throw new Error(`Não é possível excluir a escala. Existem pessoas e/ou locais de trabalho com essa escala.`);

      const index = state.scales.findIndex(item => item.id === action.payload);

      if (index !== -1)
        state.scales = state.scales.filter(item => item.id !== action.payload);
      else
        throw new Error(`Escala com o ID ${action.payload} não existe!`);
    },
    CLEAR_SCALES: (state) => {
      state.scales = [];
    },
    CREATE_REASONFORABSENCE: (state, action: PayloadAction<ReasonForAbsence>) => {
      if (!state.reasonForAbsences)
        state.reasonForAbsences = [];

      if (
        action.payload.id.length > 0 &&
        action.payload.value.length > 0
      ) {
        if (state.reasonForAbsences.filter(item => item.value === action.payload.value).length <= 0)
          state.reasonForAbsences.push(action.payload);
        else
          throw new Error(`Já existe um motivo de falta com esse valor.`);
      } else {
        throw new Error(`Não é possível criar o motivo de falta. Existem campos obrigatórios em branco.`);
      }
    },
    UPDATE_REASONFORABSENCE: (state, action: PayloadAction<ReasonForAbsence>) => {
      if (!state.reasonForAbsences)
        state.reasonForAbsences = [];

      if (
        action.payload.id.length > 0 &&
        action.payload.value.length > 0
      ) {
        if (
          state.reasonForAbsences.filter(item =>
            item.id !== action.payload.id && item.value === action.payload.value
          ).length > 0
        )
          throw new Error(`Já existe um motivo de falta com esse valor.`);

        const index = state.reasonForAbsences.findIndex(item => item.id === action.payload.id);

        if (index !== -1)
          state.reasonForAbsences[index] = action.payload;
        else
          throw new Error(`Motivo de falta com o ID ${action.payload.id} não existe!`);
      } else {
        throw new Error(`Não é possível atualizar o motivo de falta. Existem campos obrigatórios em branco.`);
      }
    },
    DELETE_REASONFORABSENCE: (state, action: PayloadAction<string>) => {
      if (!state.reasonForAbsences)
        state.reasonForAbsences = [];

      const index = state.reasonForAbsences.findIndex(item => item.id === action.payload);

      if (index !== -1)
        state.reasonForAbsences = state.reasonForAbsences.filter(item => item.id !== action.payload);
      else
        throw new Error(`Motivo de falta com o ID ${action.payload} não existe!`);
    },
    CLEAR_REASONFORABSENCES: (state) => {
      state.reasonForAbsences = [];
    },
    CREATE_SERVICE: (state, action: PayloadAction<Service>) => {
      if (!state.services)
        state.services = [];

      if (
        action.payload.id.length > 0 &&
        action.payload.value.length > 0
      ) {
        if (state.services.filter(item =>
          item.value === action.payload.value
        ).length <= 0)
          state.services.push(action.payload);
        else
          throw new Error(`Já existe um serviço com esse valor.`);
      } else {
        throw new Error(`Não é possível criar o serviço. Existem campos obrigatórios em branco.`);
      }
    },
    UPDATE_SERVICE: (state, action: PayloadAction<Service>) => {
      if (!state.services)
        state.services = [];

      if (
        action.payload.id.length > 0 &&
        action.payload.value.length > 0
      ) {
        if (
          state.services.filter(item =>
            item.id !== action.payload.id && item.value === action.payload.value
          ).length > 0
        )
          throw new Error(`Já existe um serviço com esse valor.`);

        const index = state.services.findIndex(item => item.id === action.payload.id);

        if (index !== -1)
          state.services[index] = action.payload;
        else
          throw new Error(`Serviço com o ID ${action.payload.id} não existe!`);
      } else {
        throw new Error(`Não é possível atualizar o serviço. Existem campos obrigatórios em branco.`);
      }
    },
    DELETE_SERVICE: (state, action: PayloadAction<string>) => {
      if (!state.services)
        state.services = [];

      if (
        state.workplaces.filter(item =>
          item.services.includes(action.payload)
        ).length > 0 ||
        state.people.filter(item =>
          item.services.includes(action.payload)
        ).length > 0
      )
        throw new Error(`Não é possível excluir o serviço. Existem pessoas ou locais que possuem esse serviço.`);

      const index = state.services.findIndex(item => item.id === action.payload);

      if (index !== -1)
        state.services = state.services.filter(item => item.id !== action.payload);
      else
        throw new Error(`Serviço com o ID ${action.payload} não existe!`);
    },
    CLEAR_SERVICES: (state) => {
      state.services = [];
    },
    CREATE_STREET: (state, action: PayloadAction<Street>) => {
      if (!state.streets)
        state.streets = [];

      if (
        action.payload.id.length > 0 &&
        action.payload.name.length > 0
      ) {
        if (state.streets.filter(item =>
          item.name === action.payload.name
        ).length <= 0)
          state.streets.push(action.payload);
        else
          throw new Error(`Já existe uma rua com esse nome.`);
      } else {
        throw new Error(`Não é possível criar a rua. Existem campos obrigatórios em branco.`);
      }
    },
    UPDATE_STREET: (state, action: PayloadAction<Street>) => {
      if (!state.streets)
        state.streets = [];

      if (
        action.payload.id.length > 0 &&
        action.payload.name.length > 0
      ) {
        if (
          state.streets.filter(item =>
            item.id !== action.payload.id && item.name === action.payload.name
          ).length > 0
        )
          throw new Error(`Já existe uma rua com esse nome.`);

        const index = state.streets.findIndex(item => item.id === action.payload.id);

        if (index !== -1)
          state.streets[index] = action.payload;
        else
          throw new Error(`Rua com o ID ${action.payload.id} não existe!`);
      } else {
        throw new Error(`Não é possível atualizar a rua. Existem campos obrigatórios em branco.`);
      }
    },
    DELETE_STREET: (state, action: PayloadAction<string>) => {
      if (!state.streets)
        state.streets = [];

      if (
        state.workplaces.filter(item =>
          item.address.street === action.payload
        ).length > 0 ||
        state.people.filter(item =>
          item.address.street === action.payload
        ).length > 0
      )
        throw new Error(`Não é possível excluir a rua. Existem pessoas e/ou endereços sendo usados com essa rua.`);

      const index = state.streets.findIndex(item => item.id === action.payload);

      if (index !== -1)
        state.streets = state.streets.filter(item => item.id !== action.payload);
      else
        throw new Error(`Rua com o ID ${action.payload} não existe!`);
    },
    CLEAR_STREETS: (state) => {
      state.streets = [];
    },
    CREATE_NEIGHBORHOOD: (state, action: PayloadAction<Neighborhood>) => {
      if (!state.neighborhoods)
        state.neighborhoods = [];

      if (
        action.payload.id.length > 0 &&
        action.payload.name.length > 0
      ) {
        if (state.neighborhoods.filter(item =>
          item.name === action.payload.name
        ).length <= 0)
          state.neighborhoods.push(action.payload);
        else
          throw new Error(`Já existe uma rua com esse nome.`);
      } else {
        throw new Error(`Não é possível criar a rua. Existem campos obrigatórios em branco.`);
      }
    },
    UPDATE_NEIGHBORHOOD: (state, action: PayloadAction<Neighborhood>) => {
      if (!state.neighborhoods)
        state.neighborhoods = [];

      if (
        action.payload.id.length > 0 &&
        action.payload.name.length > 0
      ) {
        if (
          state.neighborhoods.filter(item =>
            item.id !== action.payload.id && item.name === action.payload.name
          ).length > 0
        )
          throw new Error(`Já existe uma rua com esse nome.`);

        const index = state.neighborhoods.findIndex(item => item.id === action.payload.id);

        if (index !== -1)
          state.neighborhoods[index] = action.payload;
        else
          throw new Error(`Rua com o ID ${action.payload.id} não existe!`);
      } else {
        throw new Error(`Não é possível atualizar a rua. Existem campos obrigatórios em branco.`);
      }
    },
    DELETE_NEIGHBORHOOD: (state, action: PayloadAction<string>) => {
      if (!state.neighborhoods)
        state.neighborhoods = [];

      if (
        state.workplaces.filter(item =>
          item.address.neighborhood === action.payload
        ).length > 0 ||
        state.people.filter(item =>
          item.address.neighborhood === action.payload
        ).length > 0
      )
        throw new Error(`Não é possível excluir o bairro. Existem pessoas e/ou endereços sendo usados com esse bairro.`);

      const index = state.neighborhoods.findIndex(item => item.id === action.payload);

      if (index !== -1)
        state.neighborhoods = state.neighborhoods.filter(item => item.id !== action.payload);
      else
        throw new Error(`Rua com o ID ${action.payload} não existe!`);
    },
    CLEAR_NEIGHBORHOODS: (state) => {
      state.neighborhoods = [];
    },
    CREATE_CITY: (state, action: PayloadAction<City>) => {
      if (!state.cities)
        state.cities = [];

      if (
        action.payload.id.length > 0 &&
        action.payload.name.length > 0
      ) {
        if (state.cities.filter(item =>
          item.name === action.payload.name
        ).length <= 0)
          state.cities.push(action.payload);
        else
          throw new Error(`Já existe uma cidade com esse nome.`);
      } else {
        throw new Error(`Não é possível criar a cidade. Existem campos obrigatórios em branco.`);
      }
    },
    UPDATE_CITY: (state, action: PayloadAction<City>) => {
      if (!state.cities)
        state.cities = [];

      if (
        action.payload.id.length > 0 &&
        action.payload.name.length > 0
      ) {
        if (
          state.cities.filter(item =>
            item.id !== action.payload.id && item.name === action.payload.name
          ).length > 0
        )
          throw new Error(`Já existe uma cidade com esse nome.`);

        const index = state.cities.findIndex(item => item.id === action.payload.id);

        if (index !== -1)
          state.cities[index] = action.payload;
        else
          throw new Error(`Cidade com o ID ${action.payload.id} não existe!`);
      } else {
        throw new Error(`Não é possível atualizar a cidade. Existem campos obrigatórios em branco.`);
      }
    },
    DELETE_CITY: (state, action: PayloadAction<string>) => {
      if (!state.cities)
        state.cities = [];

      if (
        state.workplaces.filter(place =>
          place.address.city === action.payload
        ).length > 0 ||
        state.people.filter(item =>
          item.address.city === action.payload
        ).length > 0
      )
        throw new Error(`Não é possível excluir a cidade. Existem pessoas e/ou endereços sendo usados com essa cidade.`);

      const index = state.cities.findIndex(item => item.id === action.payload);

      if (index !== -1)
        state.cities = state.cities.filter(item => item.id !== action.payload);
      else
        throw new Error(`Cidade com o ID ${action.payload} não existe!`);
    },
    CLEAR_CITIES: (state) => {
      state.cities = [];
    },
    CREATE_DISTRICT: (state, action: PayloadAction<District>) => {
      if (!state.districts)
        state.districts = [];

      if (
        action.payload.id.length > 0 &&
        action.payload.name.length > 0
      ) {
        if (state.districts.filter(item =>
          item.name === action.payload.name
        ).length <= 0)
          state.districts.push(action.payload);
        else
          throw new Error(`Já existe um estado com esse nome.`);
      } else {
        throw new Error(`Não é possível criar o estado. Existem campos obrigatórios em branco.`);
      }
    },
    UPDATE_DISTRICT: (state, action: PayloadAction<District>) => {
      if (!state.districts)
        state.districts = [];

      if (
        action.payload.id.length > 0 &&
        action.payload.name.length > 0
      ) {
        if (
          state.districts.filter(item =>
            item.id !== action.payload.id && item.name === action.payload.name
          ).length > 0
        )
          throw new Error(`Já existe um estado com esse nome.`);

        const index = state.districts.findIndex(item => item.id === action.payload.id);

        if (index !== -1)
          state.districts[index] = action.payload;
        else
          throw new Error(`Estado com o ID ${action.payload.id} não existe!`);
      }
    },
    DELETE_DISTRICT: (state, action: PayloadAction<string>) => {
      if (!state.districts)
        state.districts = [];

      if (
        state.workplaces.filter(place =>
          place.address.district === action.payload
        ).length > 0 ||
        state.people.filter(item =>
          item.address.district === action.payload
        ).length > 0
      )
        throw new Error(`Não é possível excluir o estado. Existem pessoas e/ou endereços sendo usados com esse estado.`);

      const index = state.districts.findIndex(item => item.id === action.payload);

      if (index !== -1)
        state.districts = state.districts.filter(item => item.id !== action.payload);
      else
        throw new Error(`Estado com o ID ${action.payload} não existe!`);
    },
    CLEAR_DISTRICTS: (state) => {
      state.districts = [];
    },
    CREATE_UPLOAD: (state, action: PayloadAction<Upload>) => {
      if (!state.uploads)
        state.uploads = [];

      if (
        action.payload.fileId.length > 0 &&
        action.payload.filename.length > 0 &&
        action.payload.filetype.length > 0
      ) {
        if (
          state.uploads.filter(item =>
            item.filename === action.payload.filename &&
            item.filetype === action.payload.filetype &&
            item.version === action.payload.version &&
            item.temporary === action.payload.temporary
          ).length <= 0
        )
          state.uploads.push(action.payload);
        else
          throw new Error(`Já existe um upload com esse nome, tipo e versão.`);
      } else {
        throw new Error(`Não é possível criar o upload. Existem campos obrigatórios em branco.`);
      }
    },
    UPDATE_UPLOAD: (state, action: PayloadAction<Upload>) => {
      if (!state.uploads)
        state.uploads = [];

      if (
        action.payload.fileId.length > 0 &&
        action.payload.filename.length > 0 &&
        action.payload.filetype.length > 0
      ) {
        if (
          state.uploads.filter(item =>
            item.filename === action.payload.filename &&
            item.filetype === action.payload.filetype &&
            item.version === action.payload.version &&
            item.temporary === action.payload.temporary
          ).length > 0
        )
          throw new Error(`Já existe um upload com esse nome, tipo e versão.`);

        const index = state.uploads.findIndex(item => item.fileId === action.payload.fileId);

        if (index !== -1)
          state.uploads[index] = action.payload;
        else
          throw new Error(`Upload com o ID ${action.payload.fileId} não existe!`);
      } else {
        throw new Error(`Não é possível atualizar o upload. Existem campos obrigatórios em branco.`);
      }
    },
    DELETE_UPLOAD: (state, action: PayloadAction<string>) => {
      if (!state.uploads)
        state.uploads = [];

      const index = state.uploads.findIndex(item => item.fileId === action.payload);

      if (index !== -1)
        state.uploads = state.uploads.filter(item => item.fileId !== action.payload);
      else
        throw new Error(`Upload com o ID ${action.payload} não existe!`);
    },
    CLEAR_UPLOADS: (state) => {
      state.uploads = [];
    }
  }
})

export const SystemActions = slice.actions;

export default slice.reducer