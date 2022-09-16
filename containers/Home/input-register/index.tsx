import React from 'react'
import PhoneInput from 'react-phone-input-2'

import { Form, Input, Row, Col, message } from 'antd'
import {
  LockOutlined,
  GlobalOutlined,
  BankOutlined,
  SecurityScanOutlined
} from '@ant-design/icons'

import * as Styles from '@/containers/Home/input-register/styles'

import ButtonStyled from '@/containers/_global/_styles/_button'
import ButtonAlternateStyled from '@/containers/_global/_styles/_buttonAlternate'

import Messages from '@/containers/Home/input-register/messages'
import UserService from '@/services/user'

import PatternUsername from '@/utils/validators/pattern-username'
import PatternEmail from '@/utils/validators/pattern-email'
import PatternDomain from '@/utils/validators/pattern-domain'

declare interface Props {
  toggleIsRegister: () => void;
  buttonLogin?: boolean;
}

export default function InputRegister({
  toggleIsRegister,
  buttonLogin = true,
}: Props) {
  const { loading, register } = UserService();

  const [form] = Form.useForm();

  const onFinish = (values: {
    user_username: string;
    user_email: string;
    user_phone: string;
    user_password: string;
    company_name: string;
    company_domain: string;
    company_subdomain: string | undefined;
  }) => {
    register(
      values.user_username,
      values.user_email,
      values.user_password,
    )
      .then((user) => {
        message.success(`Bem-vindo(a) ${user.username}!. Verifique seu e-mail para ativar sua conta.`);
        toggleIsRegister();
      })
      .catch((error) => message.error(error.message))
  };

  return (
    <Form
      form={form}
      name="normal_register"
      className="register-form flex flex-col items-center justify-center"
      layout='vertical'
      onFinish={onFinish}
    >
      <Row gutter={24} className="w-[100%] lg:w-[50%]">
        <Col span={24}>
          <div className='p-5' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p className='text-white text-xl lg:text-[2rem] font-bold'>
              Crie sua conta
            </p>
          </div>
        </Col>
        <Col span={24}>
          <Styles.FormItemLight
            name="user_username"
            label="Nome de usuário"
            rules={[
              {
                required: true,
                pattern: PatternUsername,
                message: Messages.emptyOrInvalidField
              },
            ]}
          >
            <Input prefix={<GlobalOutlined className="site-form-item-icon" />} type="text" placeholder="Escreva seu nome..." />
          </Styles.FormItemLight>
        </Col>
        <Col span={24}>
          <Styles.FormItemLight
            name="user_email"
            label="Endereço de Email"
            rules={[
              {
                required: true,
                pattern: PatternEmail,
                message: Messages.emptyOrInvalidField
              },
            ]}
          >
            <Input prefix={<GlobalOutlined className="site-form-item-icon" />} type="text" placeholder="seunome@meudominio.com.br" />
          </Styles.FormItemLight>
        </Col>
        <Col span={24} lg={12}>
          <Styles.FormItemLight
            name="user_password"
            label="Senha"
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
              placeholder="********"
            />
          </Styles.FormItemLight>
        </Col>
        <Col span={24} lg={12}>
          <Styles.FormItemLight
            name="user_password_confirmation"
            label="Confirme sua senha"
            rules={[
              {
                required: true,
                message: 'Por favor, confirme sua senha!',
                validator: (rule, value, callback) => {
                  if (value && value !== form.getFieldValue('user_password')) {
                    callback('As senhas não coincidem!');
                  }
                  callback();
                }
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="********"
            />
          </Styles.FormItemLight>
        </Col>
        <Col span={24}>
          <Form.Item>
            <ButtonStyled type="primary" htmlType="submit" loading={loading}>
              Registrar
            </ButtonStyled>
            {
              buttonLogin &&
              <ButtonAlternateStyled
                type="primary"
                loading={loading}
                className="mt-3"
                onClick={toggleIsRegister}
              >
                Já tenho uma conta
              </ButtonAlternateStyled>
            }
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
};
