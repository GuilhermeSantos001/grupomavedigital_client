import React, { useEffect, useState } from 'react'

import { GetServerSidePropsContext } from 'next/types'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { PageProps } from '@/pages/_app'
import { GetMenuMain } from '@/bin/GetMenuMain'

import Fetch from '@/src/utils/fetch'
import mailConfirm from '@/src/functions/mailConfirm'

const serverSideProps: PageProps = {
  title: 'Confirmação da conta',
  description: 'Confirme sua conta para acessar o ambiente digital interativo.',
  themeColor: '#004a6e',
  menu: GetMenuMain()
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { token } = query;

  return {
    props: {
      ...serverSideProps,
      token,
      mailConfirmAuthorization: process.env.GRAPHQL_AUTHORIZATION_MAILCONFIRM!
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

const MailConfirm = ({
  token,
  mailConfirmAuthorization,
}: {
  token: string
  mailConfirmAuthorization: string,
}): JSX.Element => {
  const [isReady, setIsReady] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const _fetch = new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST!)

  useEffect(() => {
    mailConfirm(_fetch, token, mailConfirmAuthorization)
      .then(() => setIsReady(true))
      .finally(() => setIsLoading(false))
  }, []);

  return (
    <div data-testid="div-container" className="p-2">
      <h1 data-testid="text-center" className="fw-bold">
        {isLoading ? (
          compose_loading()
        ) : isReady ? (
          <p>Conta confirmada</p>
        ) : (
          <p>Não foi possível confirmar sua conta. Fale com o administrador do sistema.</p>
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
