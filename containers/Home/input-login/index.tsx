import React from 'react';
import { useRouter } from 'next/router';

import { Form, Input, Row, Col, Image, message } from 'antd';
import { LockOutlined, GlobalOutlined } from '@ant-design/icons';

import ButtonStyled from '@/containers/_global/_styles/_button';
import ButtonAlternateStyled from '@/containers/_global/_styles/_buttonAlternate';

import UserService from '@/services/user';
import useUser from '@/atom/user'

declare interface Props {
  toggleIsRegister: () => void;
  toggleIsLogged: () => void;
}

export default function InputLogin({
  toggleIsRegister,
  toggleIsLogged,
}: Props) {
  const { loading, login } = UserService();

  const router = useRouter();
  const user = useUser();

  const onFinish = (values: { email: string; password: string; }) => {
    login(values.email, values.password)
      .then((data) => {
        toggleIsLogged();
        user.set(data);
        router.push('/dashboard');
      })
      .catch((error) => message.error(error.message))
  };

  return (
    <Form
      name="normal_login"
      className="login-form h-[100vh] flex items-center justify-center"
      onFinish={onFinish}
    >
      <Row gutter={24} className={'w-[100%] lg:w-[80%]'}>
        <Col span={24} className={'my-2'}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 5 }}>
            <Image
              alt='MergeOps Logo'
              preview={false}
              src="/logo_light.svg"
            />
          </div>
        </Col>
        <Col span={24}>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Por favor, insira seu e-mail!',
              },
            ]}
          >
            <Input prefix={<GlobalOutlined className="site-form-item-icon" />} type="email" placeholder="Email" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Por favor, insira sua senha!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Senha"
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item>
            <div className='flex flex-col items-center justify-center'>
              <ButtonStyled
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Conectar
              </ButtonStyled>
              <ButtonAlternateStyled
                type="primary"
                loading={loading}
                className="mt-3"
                onClick={toggleIsRegister}
              >
                Registrar-se
              </ButtonAlternateStyled>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
