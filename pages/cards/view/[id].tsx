import { useState, useEffect } from 'react'

import { GetServerSidePropsContext } from 'next/types'

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { BoxError } from '@/components/utils/BoxError'

import Fetch from '@/src/utils/fetch'

import { PageProps } from '@/pages/_app'
import { GetMenuHome } from '@/bin/GetMenuHome'

import { uploadRaw } from '@/src/functions/getUploads'

import { DigitalCardPage, LayoutVersions } from '@/components/cards/DigitalCardPage';

import { CardInfo } from '@/src/generated/graphql'

import { useGetCardsService } from '@/services/graphql/useGetCardsService'


const serverSideProps: PageProps = {
  title: 'Cartão Digital do Grupo Mave',
  description: 'Olá, este é o cartão de visita digital interativo do Grupo Mave. Tenha todas as informações a um clique. Acesse o link e saiba mais!',
  themeColor: '#004a6e',
  fullwidth: true,
  menu: GetMenuHome('mn-home'),
}

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
  return {
    props: {
      ...serverSideProps,
      card_id: query.id,
      getCardsAuthorization: process.env.GRAPHQL_AUTHORIZATION_GETCARDS!,
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

function compose_ready(
  _fetch: Fetch,
  card: CardInfo,
  photoRaw: string,
  attachmentBusinessRaw: string,
) {
  return (
    <DigitalCardPage
      version={card.version as LayoutVersions}
      username={card.name}
      jobtitle={card.jobtitle}
      photoProfile={
        photoRaw.length > 0 ? {
          raw: photoRaw,
          id: card.photo.id,
        } : 'avatar.png'
      }
      attachmentBusiness={
        attachmentBusinessRaw.length > 0 ? {
          raw: attachmentBusinessRaw,
        } : ''
      }
      workPhone={card.phones[0]}
      cellPhone={card.phones[1]}
      whatsapp={{
        phone: card.whatsapp.phone,
        message: card.whatsapp.message,
        text: card.whatsapp.text,
      }}
      mail={card.footer.email}
      website={card.footer.website}
      googleMapsLink={card.footer.location}
    />
  )
}

export default function Cards(
  {
    card_id,
    getCardsAuthorization,
  }: {
    card_id: string,
    getCardsAuthorization: string,
  }
) {
  const [syncData, setSyncData] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(true)

  const [photoRaw, setPhotoRaw] = useState<string>('');
  const [attachmentBusinessRaw, setAttachmentBusinessRaw] = useState<string>('');

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

  useEffect(() => {
    const timer = setTimeout(async () => {
      const
        raw1 = await uploadRaw(card.photo.name, card.photo.type, card.photo.id),
        raw2 = await uploadRaw(card.footer.attachment.name, card.footer.attachment.type, card.footer.attachment.id);

      setPhotoRaw(raw1);
      setAttachmentBusinessRaw(raw2);
    });

    return () => clearTimeout(timer);
  })


  if (
    isLoadingCards && !syncData
  )
    return compose_load();

  if (
    !syncData
    && cards
    && successFetchCards

  ) {
    setSyncData(true);
    setLoading(false);
  } else if (
    !syncData && !cards
    || !syncData && !errorFetchCards
  ) {
    return <BoxError />
  }

  if (loading) return compose_load()

  const card = cards.find(card => card.cid === card_id);

  if (!card)
    return <BoxError />

  return compose_ready(
    _fetch,
    card,
    photoRaw,
    attachmentBusinessRaw
  );
}