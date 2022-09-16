import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';

import { Row, Col, Spin, message } from 'antd'

import { Props } from '@/pages/account/confirm';

import ResultStyled from '@/containers/_global/_styles/_result'
import ButtonStyled from '@/containers/_global/_styles/_button';

import Layout from '@/components/layout'
import Menu from '@/containers/Account/menu'

import UserService from '@/services/user'

export default function Component({ token }: Props) {
  const [isActive, setIsActive] = useState<boolean>()

  const router = useRouter();
  const { loading, activate } = UserService();

  const onMounted = () =>
    <Row gutter={24} className="w-[100%] p-5">
      <Col span={24} className='flex flex-col items-center justify-center h-[100vh]'>
        {isActive === undefined && <Spin size='large' />}
        {
          isActive && <ResultStyled
            status="success"
            title="Conta ativada com sucesso!"
            subTitle="Agora você já pode acessar sua conta."
            extra={[
              <ButtonStyled type="primary" key="signIn" onClick={() => router.replace('/')}>
                Entrar
              </ButtonStyled>,
            ]}
          />
        }
        {
          isActive === false && <ResultStyled
            status="error"
            title="Activation failed"
            subTitle={(
              <>
                <p>
                  Por favor, tente novamente mais tarde. Se o problema persistir, entre em contato conosco. Obrigado! <br />
                  <b>suporte@grupomave.com.br</b>
                </p>
              </>
            )}
            extra={[
              <ButtonStyled type="primary" key="goBack" onClick={() => router.replace('/')}>
                Voltar
              </ButtonStyled>,
            ]}
          />
        }
      </Col>
    </Row>

  const onLoading = () => <Spin />

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isActive === undefined) {
        activate(token)
          .then(() => {
            message.success(`Conta ativada com sucesso!`);
            setIsActive(true);
          })
          .catch((error) => {
            message.error(error.message);
            setIsActive(false);
          })
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [activate, isActive, token])

  return <Layout
    menu={Menu}
    content={(
      !loading ? onMounted() : onLoading()
    )}
  />
}
