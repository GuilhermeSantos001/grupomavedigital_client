import React, { useState } from 'react'

import { GetServerSidePropsContext } from 'next/types'

import { useGetUserInfoService } from '@/services/graphql/useGetUserInfoService'

import { compressToEncodedURIComponent } from 'lz-string'

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import NoPrivilege, { handleClickFunction } from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'

import { ListWithCheckboxMUI } from '@/components/lists/ListWithCheckboxMUI'

import { BoxError } from '@/components/utils/BoxError'

import { ManagerCards } from '@/components/modals/ManagerCards'

import { PageProps } from '@/pages/_app'
import { GetMenuMain } from '@/bin/GetMenuMain'
import { PrivilegesSystem } from '@/types/UserType'

import Alerting from '@/src/utils/alerting'

import getPeopleForTable from '@/src/functions/getPeopleForTable'

import { usePeopleService } from '@/services/usePeopleService'
import { useCardsService } from '@/services/useCardsService'
import { usePostingsService } from '@/services/usePostingsService'
import { useB2AllService } from '@/services/useB2AllService'


import { PersonType } from '@/types/PersonType'
import { CardType } from '@/types/CardType'
import { PostingType } from '@/types/PostingType'
import { B2Type } from '@/types/B2Type'

import {
  DataPersonId,
  FunctionAssignPeopleCardTypeof,
  FunctionUnassignPeopleCardTypeof
} from '@/types/CardServiceType'

const serverSideProps: PageProps = {
  title: 'Pagamentos/Cartões Benefício/Gerenciamento',
  description: 'Gerenciamento dos cartões de benefício',
  themeColor: '#004a6e',
  menu: GetMenuMain('mn-payback')
}

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const privileges: PrivilegesSystem[] = [
    'administrador',
    'ope_gerente',
    'ope_coordenador'
  ]

  return {
    props: {
      ...serverSideProps,
      privileges,
      auth: req.cookies.auth,
      getUserInfoAuthorization: process.env.GRAPHQL_AUTHORIZATION_GETUSERINFO!,
    },
  }
}

// TODO: Implementar o esqueleto de loading da página
function compose_load() {
  return (
    <div>
      <div className="d-block d-md-none">
        <div className="col-12">
          <div className="d-flex flex-column p-2">
            <div className="col-12 px-2">
              <SkeletonLoader
                width={'100%'}
                height={'10rem'}
                radius={10}
                circle={false}
                style={{ marginTop: '0.1rem' }}
              />
              <SkeletonLoader
                width={'100%'}
                height={'10rem'}
                radius={10}
                circle={false}
                style={{ marginTop: '1rem' }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="d-none d-md-flex">
        <div className="col-12">
          <div className="row g-2">
            <div className="col-12 col-md-6">
              <div className="p-1">
                <SkeletonLoader
                  width={'100%'}
                  height={'10rem'}
                  radius={10}
                  circle={false}
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="p-1">
                <SkeletonLoader
                  width={'100%'}
                  height={'10rem'}
                  radius={10}
                  circle={false}
                />
              </div>
            </div>
          </div>
          <div className="col-12 p-2">
            <SkeletonLoader
              width={'100%'}
              height={'0.1rem'}
              radius={0}
              circle={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function compose_noPrivilege(handleClick: handleClickFunction) {
  return <NoPrivilege handleClick={handleClick} />
}

function compose_noAuth(handleClick: handleClickFunction) {
  return <NoAuth handleClick={handleClick} />
}

function compose_ready(
  handleClickBackPage: () => void,
  privileges: PrivilegesSystem[],
  auth: string,
  pageSize: number,
  pageSizeOptions: number[],
  peopleSelected: string[],
  handleChangePageSize: (size: number) => void,
  handleChangePeopleSelected: (items: string[]) => void,
  handleChangePersonId: (id: string) => void,
  people: PersonType[],
  cards: CardType[],
  assignPersonCard: FunctionAssignPeopleCardTypeof,
  unassignPersonCard: FunctionUnassignPeopleCardTypeof,
  showModalManagerCards: boolean,
  handleOpenModalManagerCards: () => void,
  handleCloseModalManagerCards: () => void,
  postings: PostingType[],
  postingsB2: B2Type[]
) {
  const
    { columns: peopleColumns, rows: peopleRows } =
      getPeopleForTable(people),
    personSelected = peopleSelected.length == 1 ? people.find(person => person.id === peopleSelected[0]) : null

  return (
    <>
      {
        personSelected &&
        <ManagerCards
          open={showModalManagerCards}
          person={personSelected}
          cards={cards}
          postings={postings}
          postingsB2={postingsB2}
          assignPersonCard={assignPersonCard}
          unassignPersonCard={unassignPersonCard}
          handleClose={handleCloseModalManagerCards}
        />
      }
      <div className="row g-2">
        <div className="col-12">
          <div className="p-3 bg-primary bg-gradient rounded">
            <p className="text-center text-secondary fw-bold fs-5 my-2">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'id-card')}
                className="me-2 fs-3 flex-shrink-1 text-secondary my-auto"
              /> Controle dos Cartões Alelo
            </p>
          </div>
          <button
            type="button"
            className="btn btn-link"
            onClick={handleClickBackPage}
          >
            Voltar
          </button>
          <p className="fw-bold border-bottom text-center my-2">
            Colaboradores
          </p>
          <div className='d-flex flex-column p-2' style={{ marginBottom: '12vh' }}>
            <ListWithCheckboxMUI
              columns={peopleColumns}
              rows={peopleRows}
              pageSize={pageSize}
              pageSizeOptions={pageSizeOptions}
              deepCompare={true}
              onChangeSelection={handleChangePeopleSelected}
              onPageSizeChange={handleChangePageSize}
            />
          </div>
          <div className='d-flex flex-column flex-md-row'>
            <button
              type="button"
              className="btn btn-link ms-3"
              disabled={!personSelected}
              onClick={handleOpenModalManagerCards}
            >
              <FontAwesomeIcon
                icon={Icon.render('fas', 'address-card')}
                className="me-1 flex-shrink-1 my-auto"
              /> Gerenciar Cartões
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Manager(
  {
    privileges,
    auth,
    getUserInfoAuthorization,
  }: {
    privileges: PrivilegesSystem[],
    auth: string,
    getUserInfoAuthorization: string
  }
) {
  const [syncData, setSyncData] = useState<boolean>(false)

  const [isReady, setReady] = useState<boolean>(false)
  const [notPrivilege, setNotPrivilege] = useState<boolean>(false)
  const [notAuth, setNotAuth] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const [personId, setPersonId] = useState<string>('')

  const [pageSize, setPageSize] = useState<number>(10)

  const pageSizeOptions = [10, 20, 50, 100];

  const [peopleSelected, setPeopleSelected] = useState<string[]>([]);

  const [showModalManagerCards, setShowModalManagerCards] = useState<boolean>(false)

  const { success, data, error } = useGetUserInfoService(
    {
      auth: compressToEncodedURIComponent(auth),
    },
    {
      authorization: getUserInfoAuthorization,
      encodeuri: 'true'
    }
  );

  const
    { data: people, isLoading: isLoadingPeople } = usePeopleService(),
    { data: cards, isLoading: isLoadingCards, assignPerson: AssignPersonCard, unassignPerson: UnassignPersonCard } = useCardsService(),
    { data: postings, isLoading: isLoadingPostings } = usePostingsService(),
    { data: postingsB2, isLoading: isLoadingPostingsB2 } = useB2AllService();

  const router = useRouter()

  const
    handleClickNoAuth: handleClickFunction = async (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      path: string
    ) => {
      event.preventDefault();
      if (path === '/auth/login')
        router.push(path);
    },
    handleClickNoPrivilege: handleClickFunction = async (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      path: string
    ) => {
      event.preventDefault();
      router.push(path);
    },
    handleClickBackPage = () => router.push('/payback/postings'),
    handleChangePageSize = (value: number) => setPageSize(value),
    handleChangePeopleSelected = (items: string[]) => setPeopleSelected(items),
    handleChangePersonId = (id: string) => setPersonId(id),
    handleAssignPersonCard: FunctionAssignPeopleCardTypeof = async (id: string, dataPersonId: DataPersonId[]) => {
      if (!AssignPersonCard)
        return Alerting.create('error', 'Não é possível associar o(a) funcionario(a) ao cartão. Tente novamente, mais tarde!');

      for (const data of dataPersonId) {
        const person = people.find(person => person.id === data.personId);

        if (!person)
          return Alerting.create('error', `Funcionario(a) ${data.personId} não encontrado(a)!`);

        const assigned = await AssignPersonCard(id, { personId: person.id });

        if (!assigned)
          return Alerting.create('error', `Não é possível associar o(a) funcionario(a) ${person.id} ao cartão. Tente novamente, mais tarde!`);

        Alerting.create('success', `${person.name} associado(a) ao cartão com sucesso!`);
      }
    },
    handleUnassignPersonCard: FunctionUnassignPeopleCardTypeof = async (cardsId: string[]) => {
      if (!UnassignPersonCard)
        return Alerting.create('error', 'Não é possível desassociar o(a) funcionario(a) do cartão. Tente novamente, mais tarde!');

      for (const id of cardsId) {
        const unassigned = await UnassignPersonCard(id);

        if (!unassigned)
          return Alerting.create('error', `Não é possível desassociar o(a) funcionario(a) do cartão. Tente novamente, mais tarde!`);

        Alerting.create('success', `Funcionario(a) desassociado(a) do cartão com sucesso!`);
      }
    },
    handleOpenModalManagerCards = () => setShowModalManagerCards(true),
    handleCloseModalManagerCards = () => setShowModalManagerCards(false)

  if (error && !notAuth) {
    setNotAuth(true);
    setLoading(false);
  }

  if (success && data && !isReady) {
    if (
      privileges
        .filter(privilege => data.privileges.indexOf(privilege) !== -1)
        .length <= 0
    )
      setNotPrivilege(true);

    setReady(true);
    setLoading(false);
  }

  if (
    isLoadingPeople && !syncData
    || isLoadingCards && !syncData
    || isLoadingPostings && !syncData
    || isLoadingPostingsB2 && !syncData
  )
    return compose_load();

  if (
    !syncData
    && people
    && cards
    && postings
    && postingsB2
  ) {
    setSyncData(true);
  } else if (
    !syncData && !people
    || !syncData && !cards
    || !syncData && !AssignPersonCard
    || !syncData && !UnassignPersonCard
    || !syncData && !postings
    || !syncData && !postingsB2
  ) {
    return <BoxError />
  }

  if (loading) return compose_load()

  if (notPrivilege) return compose_noPrivilege(handleClickNoPrivilege)

  if (notAuth) return compose_noAuth(handleClickNoAuth)

  if (isReady) return compose_ready(
    handleClickBackPage,
    data?.privileges as PrivilegesSystem[],
    auth,
    pageSize,
    pageSizeOptions,
    peopleSelected,
    handleChangePageSize,
    handleChangePeopleSelected,
    handleChangePersonId,
    people,
    cards,
    handleAssignPersonCard,
    handleUnassignPersonCard,
    showModalManagerCards,
    handleOpenModalManagerCards,
    handleCloseModalManagerCards,
    postings,
    postingsB2,
  )
}