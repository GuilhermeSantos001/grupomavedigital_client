import { useState } from 'react'

import { GetServerSidePropsContext } from 'next/types'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { BoxError } from '@/components/utils/BoxError'

import { PageProps } from '@/pages/_app'
import { GetMenuHome } from '@/bin/GetMenuHome'

import { uploadStaticRaw } from '@/src/functions/getUploads'

import { DigitalCardPage, LayoutVersions } from '@/components/cards/DigitalCardPage';

import { CardInfo } from '@/src/generated/graphql'

import { findCard } from '@/src/functions/graphql/findCard'

const serverSideProps: PageProps = {
  title: 'Cartão Digital do Grupo Mave',
  description: 'Olá, este é o cartão de visita digital interativo do Grupo Mave. Tenha todas as informações a um clique. Acesse o link e saiba mais!',
  themeColor: '#004a6e',
  fullwidth: true,
  cleanLayout: true,
  menu: GetMenuHome('mn-home'),
}

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
  const { data: card } = await findCard({ cid: query.id as string }, {
    authorization: process.env.GRAPHQL_AUTHORIZATION_FINDCARD!,
    encodeuri: 'false'
  });

  let
    photoRaw = '',
    attachmentBusinessRaw = '';

  if (card) {
    if (await uploadStaticRaw(card.photo.name, card.photo.type, card.photo.id)) {
      photoRaw = `${process.env.NEXT_PUBLIC_EXPRESS_HOST!}/temp/${card.photo.name}${card.photo.type}`;
    }

    if (await uploadStaticRaw(card.footer.attachment.name, card.footer.attachment.type, card.footer.attachment.id)) {
      attachmentBusinessRaw = `${process.env.NEXT_PUBLIC_EXPRESS_HOST!}/temp/${card.footer.attachment.name}${card.footer.attachment.type}`;
    }
  }

  return {
    props: {
      ...serverSideProps,
      customHead: {
        url: `${process.env.NEXT_PUBLIC_HOST}/cards/view/${query.id}`,
        og_image: photoRaw,
        icon: photoRaw,
        apple_touch_icon: photoRaw,
        apple_touch_startup_image: photoRaw,
        apple_mobile_web_app_title: `Cartão Digital do Grupo Mave - ${card && card.name || '???'}`
      },
      card,
      photoRaw,
      attachmentBusinessRaw
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
      attachmentVCard={{
        ...card.vcard.metadata.file
      }}
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
      socialmedia={{
        facebook: card.footer.socialmedia.find(social => social.name === 'facebook')?.value,
        youtube: card.footer.socialmedia.find(social => social.name === 'youtube')?.value,
        linkedin: card.footer.socialmedia.find(social => social.name === 'linkedin')?.value,
        instagram: card.footer.socialmedia.find(social => social.name === 'instagram')?.value,
        twitter: card.footer.socialmedia.find(social => social.name === 'twitter')?.value,
        tiktok: card.footer.socialmedia.find(social => social.name === 'tiktok')?.value,
        flickr: card.footer.socialmedia.find(social => social.name === 'flickr')?.value,
      }}
    />
  )
}

export default function ViewCard(
  {
    card,
    photoRaw,
    attachmentBusinessRaw,
  }: {
    card: CardInfo,
    photoRaw: string,
    attachmentBusinessRaw: string
  }
) {
  const [syncData, setSyncData] = useState<boolean>(false)

  if (
    !syncData && card
  ) {
    setSyncData(true);
  } else if (
    !syncData && !card
  ) {
    return <BoxError />
  }

  return compose_ready(
    card,
    photoRaw,
    attachmentBusinessRaw
  );
}