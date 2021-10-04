/**
 * @description Pagina para confirmação do e-mail usuario
 * @author @GuilhermeSantos001
 * @update 04/10/2021
 */

import React, { useEffect, useState } from 'react'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { PageProps } from '@/pages/_app'

import Fetch from '@/src/utils/fetch'
import mailConfirm from '@/src/functions/mailConfirm'

const serverSideProps: PageProps = {
  title: 'Confirmação da conta',
  description: 'Confirme sua conta para acessar o ambiente digital interativo.',
  themeColor: '#004a6e',
  menu: [
    {
      id: 'mn-helping',
      active: false,
      icon: {
        family: 'fas',
        name: 'question-circle',
      },
      type: 'dropdown',
      name: 'Precisa de Ajuda?',
      dropdownId: 'navbarDropdown',
      content: [
        {
          id: 'md-helpdesk',
          icon: {
            family: 'fas',
            name: 'headset',
          },
          name: 'HelpDesk',
          link: '/help/helpdesk',
        },
        {
          id: 'md-sp1',
          type: 'separator',
        },
        {
          id: 'md-docs',
          icon: {
            family: 'fas',
            name: 'book-reader',
          },
          name: 'Manuais',
          link: '/help/docs',
        },
      ],
    },
  ],
}

export async function getServerSideProps(context) {
  const { token } = context.query

  return {
    props: {
      ...serverSideProps,
      token,
    },
  }
}

function compose_loading() {
  return (
    <div className="d-flex flex-column">
      <div className="col-12">
        <SkeletonLoader width={'100%'} height={80} radius={0} circle={false} />
      </div>
      <div className="col-12 my-1">
        <SkeletonLoader
          width={'100%'}
          height={`0.2rem`}
          radius={0}
          circle={false}
        />
      </div>
      <div className="col-12">
        <SkeletonLoader width={'100%'} height={40} radius={0} circle={false} />
      </div>
    </div>
  )
}

const MailConfirm = ({ token }): JSX.Element => {
  const [isReady, setIsReady] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const _fetch = new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST)

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (await mailConfirm(_fetch, token)) setIsReady(true)
      setIsLoading(false)
    })

    return () => clearTimeout(timer)
  }, [])

  return (
    <div data-testid="div-container" className="p-2">
      <h1 data-testid="text-center" className="fw-bold">
        {isLoading ? (
          compose_loading()
        ) : isReady ? (
          <p>Conta confirmada</p>
        ) : (
          <p>Não foi possivel confirmar sua conta!</p>
        )}
      </h1>
      {isReady ? (
        <>
          <hr data-testid="separator" className="text-muted" />
          <p>Você já pode fechar essa janela!</p>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default MailConfirm
