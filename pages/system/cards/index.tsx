import { useState } from 'react'

import { css } from '@emotion/css'

import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { GetServerSidePropsContext } from 'next/types'

import { useGetUserInfoService } from '@/services/graphql/useGetUserInfoService'

import { compressToEncodedURIComponent } from 'lz-string'

import Image from 'next/image'
import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import { handleClickFunction } from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'

import { BoxError } from '@/components/utils/BoxError'

import { ListWithCheckbox } from '@/components/lists/ListWithCheckbox'
import { OffcanvasInformation } from '@/components/offcanvas/OffcanvasInformation'
import { RegisterDigitalCard } from '@/components/modals/RegisterDigitalCard'

import Fetch from '@/src/utils/fetch'

import Sugar from 'sugar'
import DateEx from '@/src/utils/dateEx'

import { PageProps } from '@/pages/_app'
import { GetMenuMain } from '@/bin/GetMenuMain'

import getDigitalCardForTable from '@/src/functions/getDigitalCardForTable'

import { CardInfo } from '@/src/generated/graphql'

import { useGetCardsService } from '@/services/graphql/useGetCardsService'

import { SocketConnection } from '@/components/socket-io'
import {
  FilesSocketEvents
} from '@/constants/SocketEvents'
import {
  TYPEOF_EMITTER_FILE_DELETE_ATTACHMENT,
  TYPEOF_LISTENER_FILE_DELETE_ATTACHMENT,
} from '@/constants/SocketFileType'

import {
  FunctionCreateCardTypeof,
  useCreateCardsService,
} from '@/services/graphql/useCreateCardsService'

import {
  FunctionCreateVCardTypeof,
  useCreateVCardsService,
} from '@/services/graphql/useCreateVCardsService'

import type {
  UploadType
} from '@/types/UploadType'

import type {
  StreetType
} from '@/types/StreetType'

import type {
  CityType
} from '@/types/CityType'

import type {
  DistrictType
} from '@/types/DistrictType'

import type {
  FunctionCreateUploadTypeof,
  FunctionUpdateUploadsTypeof
} from '@/types/UploadServiceType'

import type {
  FunctionCreateStreetTypeof,
  FunctionUpdateStreetsTypeof,
  FunctionDeleteStreetsTypeof,
} from '@/types/StreetServiceType'

import type {
  FunctionCreateCityTypeof,
  FunctionUpdateCitiesTypeof,
  FunctionDeleteCitiesTypeof,
} from '@/types/CityServiceType'

import type {
  FunctionCreateDistrictTypeof,
  FunctionUpdateDistrictsTypeof,
  FunctionDeleteDistrictsTypeof,
} from '@/types/DistrictServiceType'

import {
  useStreetService
} from '@/services/useStreetService'

import {
  useStreetsService
} from '@/services/useStreetsService'

import {
  useCityService
} from '@/services/useCityService'

import {
  useCitiesService
} from '@/services/useCitiesService'

import {
  useDistrictService
} from '@/services/useDistrictService'

import {
  useDistrictsService
} from '@/services/useDistrictsService'

import { useUploadService } from '@/services/useUploadService'
import { useUploadsService } from '@/services/useUploadsService'

import Alerting from '@/src/utils/alerting'

interface PageData {
  photoProfile: string
  username: string
  name: string
  surname: string
  privilege: string
}

const serverSideProps: PageProps = {
  title: 'System/Cartões Digitais',
  description: 'Crie e compartilhe seus cartões digitais',
  themeColor: '#004a6e',
  menu: GetMenuMain('mn-dashboard')
}

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  return {
    props: {
      ...serverSideProps,
      auth: req.cookies.auth,
      getUserInfoAuthorization: process.env.GRAPHQL_AUTHORIZATION_GETUSERINFO!,
      getCardsAuthorization: process.env.GRAPHQL_AUTHORIZATION_GETCARDS!,
      createCardsAuthorization: process.env.GRAPHQL_AUTHORIZATION_CREATECARDS!,
      createVCardsAuthorization: process.env.GRAPHQL_AUTHORIZATION_CREATEVCARDS!,
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
            <div className="col-12 d-flex justify-content-center">
              <SkeletonLoader
                width={100}
                height={100}
                radius={10}
                circle={true}
              />
            </div>
            <div className="col-12 d-flex flex-column">
              <SkeletonLoader
                width="70%"
                height="1rem"
                circle={false}
                style={{
                  marginTop: '1rem',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              />
              <SkeletonLoader
                width="70%"
                height="1rem"
                circle={false}
                style={{
                  marginTop: '1rem',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              />
            </div>
            <div className="col-12 my-2 p-2">
              <SkeletonLoader
                width={'100%'}
                height={'0.1rem'}
                radius={0}
                circle={false}
              />
            </div>
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
          <div className="d-flex flex-row p-2">
            <div className="col-1 d-flex justify-content-center">
              <SkeletonLoader
                width={100}
                height={100}
                radius={20}
                circle={true}
              />
            </div>
            <div className="col-10 d-flex flex-column px-2">
              <SkeletonLoader
                width="20%"
                height="1rem"
                circle={false}
                style={{ marginTop: '2rem' }}
              />
              <SkeletonLoader
                width="20%"
                height="1rem"
                circle={false}
                style={{ marginTop: 5 }}
              />
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

function compose_noAuth(handleClick: handleClickFunction) {
  return <NoAuth handleClick={handleClick} />
}

function compose_ready(
  { photoProfile, username, name, surname, privilege }: PageData,
  auth: string,
  _fetch: Fetch,
  createCardsAuthorization: string,
  createVCardsAuthorization: string,
  createUpload: FunctionCreateUploadTypeof,
  uploads: UploadType[],
  isLoadingUploads: boolean,
  updateUploads: FunctionUpdateUploadsTypeof,
  handleRemoveUploadedFile: (filesId: string[], mirrorsId: string[]) => void,
  streets: StreetType[],
  isLoadingStreets: boolean,
  cities: CityType[],
  isLoadingCities: boolean,
  districts: DistrictType[],
  isLoadingDistricts: boolean,
  createStreet: FunctionCreateStreetTypeof,
  updateStreets: FunctionUpdateStreetsTypeof,
  deleteStreets: FunctionDeleteStreetsTypeof,
  createCity: FunctionCreateCityTypeof,
  updateCities: FunctionUpdateCitiesTypeof,
  deleteCities: FunctionDeleteCitiesTypeof,
  createDistrict: FunctionCreateDistrictTypeof,
  updateDistricts: FunctionUpdateDistrictsTypeof,
  deleteDistricts: FunctionDeleteDistrictsTypeof,
  cards: CardInfo[],
  showOffcanvasInfo: boolean,
  handleShowOffcanvasInfo: () => void,
  handleCloseOffcanvasInfo: () => void,
  createCard: FunctionCreateCardTypeof,
  createVCard: FunctionCreateVCardTypeof,
  openModalRegisterDigitalCard: boolean,
  handleOpenModalRegisterDigitalCard: () => void,
  handleCloseModalRegisterDigitalCard: () => void,
) {
  const {
    columns: cardsColumns,
    rows: cardsRows
  } = getDigitalCardForTable(cards);

  return (
    <>
      {!window.socket && <SocketConnection />}
      <OffcanvasInformation
        title='Recurso em Desenvolvimento'
        message={`
        Disponibilizamos o recurso em fase de desenvolvimento para que você possa
        testar o funcionamento, esperamos o seu feedback. ;)
        `}
        show={showOffcanvasInfo}
        handleClose={handleCloseOffcanvasInfo}
      />
      <RegisterDigitalCard
        open={openModalRegisterDigitalCard}
        fetch={_fetch}
        createCardsAuthorization={createCardsAuthorization}
        createVCardsAuthorization={createVCardsAuthorization}
        createCard={createCard}
        createVCard={createVCard}
        createUpload={createUpload}
        uploads={uploads}
        isLoadingUploads={isLoadingUploads}
        updateUploads={updateUploads}
        handleRemoveUploadedFile={handleRemoveUploadedFile}
        streets={streets}
        isLoadingStreets={isLoadingStreets}
        cities={cities}
        isLoadingCities={isLoadingCities}
        districts={districts}
        isLoadingDistricts={isLoadingDistricts}
        createStreet={createStreet}
        updateStreets={updateStreets}
        deleteStreets={deleteStreets}
        createCity={createCity}
        updateCities={updateCities}
        deleteCities={deleteCities}
        createDistrict={createDistrict}
        updateDistricts={updateDistricts}
        deleteDistricts={deleteDistricts}
        auth={auth}
        photoProfile={photoProfile}
        username={Sugar.String.capitalize(username)}
        name={Sugar.String.capitalize(name)}
        surname={Sugar.String.capitalize(surname)}
        jobtitle={Sugar.String.capitalize(privilege)}
        handleClose={handleCloseModalRegisterDigitalCard}
      />
      <div className="d-flex flex-column p-2">
        <div
          className="d-flex flex-column flex-md-row p-2"
          style={{ fontFamily: 'Fira Code' }}
        >
          <div className="col-4 col-md-1 d-flex flex-column flex-md-row align-self-center justify-content-center">
            <Image
              src={`/uploads/${photoProfile}`}
              alt="Você ;)"
              className="rounded-circle"
              width={100}
              height={100}
            />
          </div>
          <div className="col-12 col-md-10 d-flex flex-column align-self-center text-center text-md-start px-2">
            <p className="mt-2 mb-1 fw-bold">
              {Sugar.String.capitalize(username)}
            </p>
            <p className="mb-1">
              {
                <b className="text-primary fw-bold">
                  {Sugar.String.capitalize(privilege)}
                </b>
              }
            </p>
          </div>
        </div>
        <div className='d-flex flex-column'>
          <div
            className={`animation-delay d-flex flex-row ${css`
              padding: 15px;
              background-color: #c9c9c9;
              font-size: 14px;
              border-radius: 4px;
              color: #404040;
              cursor: pointer;
              &:hover {
                color: ${'#004a6e'};
              }
            `}`}
            onClick={handleShowOffcanvasInfo}
          >
            <p className="col text-start fw-bold my-auto">
              Os cartões digitais estão em fase de desenvolvimento, mas já podem
              ser usados, porém seu funcionamento mudará ao decorrer do tempo,
              mas não há nenhuma mudança crítica que faça seu cartão ficar
              indisponível.
            </p>
            <p className="col-1 text-end fw-bold my-auto">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'info-circle')}
                className="me-2 fs-3 flex-shrink-1 my-auto"
              />
            </p>
          </div>
          <ListWithCheckbox
            title='Seus cartões digitais'
            messages={{
              emptyDataSourceMessage: 'Você ainda não possui nenhum cartão disponível.',
            }}
            columns={cardsColumns}
            data={cardsRows}
            onChangeSelection={(items: string[]) => console.log(items)}
          />
        </div>
        <Button
          className="p-2 mx-2 col-2"
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={handleOpenModalRegisterDigitalCard}
        >
          Adicionar
        </Button>
      </div>
    </>
  )
}

export default function Cards(
  {
    auth,
    getUserInfoAuthorization,
    getCardsAuthorization,
    createCardsAuthorization,
    createVCardsAuthorization
  }: {
    auth: string,
    getUserInfoAuthorization: string,
    getCardsAuthorization: string,
    createCardsAuthorization: string,
    createVCardsAuthorization: string,
  }
) {
  const [syncData, setSyncData] = useState<boolean>(false)

  const [isReady, setReady] = useState<boolean>(false)
  const [notAuth, setNotAuth] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const [showOffcanvasInfo, setShowOffcanvasInfo] = useState<boolean>(false)
  const [openModalRegisterDigitalCard, setOpenModalRegisterDigitalCard] = useState<boolean>(false)

  const { success, data, error } = useGetUserInfoService(
    {
      auth: compressToEncodedURIComponent(auth),
    },
    {
      authorization: getUserInfoAuthorization,
      encodeuri: 'true'
    }
  );

  const router = useRouter()
  const _fetch = new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST!)

  const
    { data: cards, isValidating: isLoadingCards, success: successFetchCards, error: errorFetchCards } = useGetCardsService({
      lastIndex: "",
      limit: 100,
    }, {
      authorization: getCardsAuthorization,
      encodeuri: 'false'
    });

  const
    { create: CreateCards } = useCreateCardsService(),
    { create: CreateVCards } = useCreateVCardsService(),
    { create: CreateUpload } = useUploadService(),
    { data: uploads, isLoading: isLoadingUploads, update: UpdateUploads, delete: DeleteUploads } = useUploadsService(),
    { create: CreateStreet } = useStreetService(),
    { data: streets, isLoading: isLoadingStreets, update: UpdateStreets, delete: DeleteStreets } = useStreetsService(),
    { create: CreateCity } = useCityService(),
    { data: cities, isLoading: isLoadingCities, update: UpdateCities, delete: DeleteCities } = useCitiesService(),
    { create: CreateDistrict } = useDistrictService(),
    { data: districts, isLoading: isLoadingDistricts, update: UpdateDistricts, delete: DeleteDistricts } = useDistrictsService();

  const
    handleClickNoAuth: handleClickFunction = async (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      path: string
    ) => {
      event.preventDefault();
      if (path === '/auth/login')
        router.push(path);
    },
    handleShowOffcanvasInfo = () => setShowOffcanvasInfo(true),
    handleCloseOffcanvasInfo = () => setShowOffcanvasInfo(false),
    handleOpenModalRegisterDigitalCard = () => setOpenModalRegisterDigitalCard(true),
    handleCloseModalRegisterDigitalCard = () => setOpenModalRegisterDigitalCard(false),
    handleRemoveUploadedFile = (filesId: string[], mirrorsId: string[]) =>
      window.socket.emit(
        FilesSocketEvents.FILE_DELETE_ATTACHMENT,
        window.socket.compress<TYPEOF_EMITTER_FILE_DELETE_ATTACHMENT>({
          filesId,
          mirrorsId
        })
      ),
    handleDeleteUpload = async (mirrorId: string) => {
      if (!DeleteUploads)
        return Alerting.create('error', 'Não foi possível deletar o(s) anexo(s) selecionado(s). Tente novamente, mais tarde.');

      const deleted = await DeleteUploads(mirrorId);

      if (deleted) {
        Alerting.create('success', `Arquivo deletado com sucesso.`);
      } else {
        Alerting.create('error', `Não foi possível deletar o arquivo. Tente novamente, mais tarde.`);
      }
    };

  if (error && !notAuth) {
    setNotAuth(true);
    setLoading(false);
  }

  if (success && data && !isReady) {
    setReady(true);
    setLoading(false);
  }

  if (
    isLoadingCards && !syncData
    || isLoadingUploads && !syncData
    || isLoadingStreets && !syncData
    || isLoadingCities && !syncData
    || isLoadingDistricts && !syncData
  )
    return compose_load();

  if (
    !syncData
    && cards
    && successFetchCards
    && uploads
    && streets
    && cities
    && districts

  ) {
    setSyncData(true);
  } else if (
    !syncData && !cards
    || !syncData && !errorFetchCards
    || !syncData && !uploads
    || !syncData && !UpdateUploads
    || !syncData && !DeleteUploads
    || !syncData && !streets
    || !syncData && !UpdateStreets
    || !syncData && !DeleteStreets
    || !syncData && !cities
    || !syncData && !UpdateCities
    || !syncData && !DeleteCities
    || !syncData && !districts
    || !syncData && !UpdateDistricts
    || !syncData && !DeleteDistricts
  ) {
    return <BoxError />
  }

  if (loading) return compose_load()

  if (notAuth) return compose_noAuth(handleClickNoAuth)

  if (isReady) {
    onSocketEvents(handleDeleteUpload);

    return compose_ready(
      {
        photoProfile: data?.photoProfile || '',
        username: data?.username || '???',
        name: data?.name || '???',
        surname: data?.surname || '???',
        privilege: data?.privilege || '???',
      },
      auth,
      _fetch,
      createCardsAuthorization,
      createVCardsAuthorization,
      CreateUpload,
      uploads,
      isLoadingUploads,
      UpdateUploads,
      handleRemoveUploadedFile,
      streets,
      isLoadingStreets,
      cities,
      isLoadingCities,
      districts,
      isLoadingDistricts,
      CreateStreet,
      UpdateStreets,
      DeleteStreets,
      CreateCity,
      UpdateCities,
      DeleteCities,
      CreateDistrict,
      UpdateDistricts,
      DeleteDistricts,
      cards,
      showOffcanvasInfo,
      handleShowOffcanvasInfo,
      handleCloseOffcanvasInfo,
      CreateCards,
      CreateVCards,
      openModalRegisterDigitalCard,
      handleOpenModalRegisterDigitalCard,
      handleCloseModalRegisterDigitalCard
    );
  }
}

/**
 * @description Adiciona os ouvintes dos eventos do socket.io
 */
function onSocketEvents(
  handleDeleteUpload: (fileId: string) => void
) {
  const socket = window.socket;

  if (socket) {
    const
      events = [
        `${FilesSocketEvents.FILE_DELETE_ATTACHMENT}-SUCCESS`,
        `${FilesSocketEvents.FILE_DELETE_ATTACHMENT}-FAILURE`,
      ]

    events
      .forEach(event => {
        if (socket.hasListeners(event))
          socket.off(event);
      })

    socket
      .on(
        events[0], // * FILE-DELETE-ATTACHMENT-SUCCESS
        (
          data: string
        ) => {
          const {
            mirrorsId
          } = socket.decompress<TYPEOF_LISTENER_FILE_DELETE_ATTACHMENT>(data);
          mirrorsId.forEach(mirrorId => handleDeleteUpload(mirrorId));
        }
      )

    socket
      .on(
        events[1], // * FILE-DELETE-ATTACHMENT-FAILURE
        (error: string) => console.error(error)
      )
  }
}