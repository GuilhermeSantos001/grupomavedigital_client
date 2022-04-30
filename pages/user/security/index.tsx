import React, { useEffect, useMemo, useState } from 'react'

import { Modal } from 'react-bootstrap'

import { GetServerSidePropsContext } from 'next/types'

import { useGetUserInfoService } from '@/services/graphql/useGetUserInfoService'

import { compressToEncodedURIComponent } from 'lz-string'

import Image from 'next/image'
import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import Sugar from 'sugar'

import { handleClickFunction } from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'
import Alerting from '@/src/utils/alerting'

import { PageProps } from '@/pages/_app'
import { GetMenuMain } from '@/bin/GetMenuMain'

import Fetch from '@/src/utils/fetch'
import hasConfiguredTwoFactor from '@/src/functions/hasConfiguredTwoFactor'
import authSignTwofactor from '@/src/functions/authSignTwofactor'
import authVerifyTwofactor from '@/src/functions/authVerifyTwofactor'
import authEnabledTwofactor from '@/src/functions/authEnabledTwofactor'
import authDisableTwofactor from '@/src/functions/authDisableTwofactor'
import checkPassword from '@/src/utils/checkPassword'
import changePassword from '@/src/functions/changePassword'

interface PageData {
  photoProfile: string
  username: string
  privilege: string
}

const serverSideProps: PageProps = {
  title: 'Segurança',
  description: 'Configurações pessoais de segurança',
  themeColor: '#004a6e',
  menu: GetMenuMain('mn-security')
}

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  return {
    props: {
      ...serverSideProps,
      auth: req.cookies.auth,
      getUserInfoAuthorization: process.env.GRAPHQL_AUTHORIZATION_GETUSERINFO!,
      authSignTwofactorAuthorization: process.env.GRAPHQL_AUTHORIZATION_AUTHSIGNTWOFACTOR!,
      authVerifyTwofactorAuthorization: process.env.GRAPHQL_AUTHORIZATION_AUTHVERIFYTWOFACTOR!,
      authEnabledTwofactorAuthorization: process.env.GRAPHQL_AUTHORIZATION_AUTHENABLEDTWOFACTOR!,
      authDisableTwofactorAuthorization: process.env.GRAPHQL_AUTHORIZATION_AUTHDISABLEDTWOFACTOR!,
      changePasswordAuthorization: process.env.GRAPHQL_AUTHORIZATION_CHANGEPASSWORD!,
      hasConfiguredTwoFactorAuthorization: process.env.GRAPHQL_AUTHORIZATION_HASCONFIGUREDTWOFACTOR!,
    },
  }
}

function compose_load() {
  return (
    <div>
      <div className="d-flex flex-column">
        <div className="col-12">
          <div className="d-flex d-md-none flex-column p-2">
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
          </div>
          <div className="d-none d-md-flex flex-row p-2">
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
            <div className="col-12">
              <div className="p-1">
                <SkeletonLoader
                  width={'100%'}
                  height={'8rem'}
                  radius={10}
                  circle={false}
                />
              </div>
              <div className="p-1">
                <SkeletonLoader
                  width={'100%'}
                  height={'3rem'}
                  radius={10}
                  circle={false}
                />
              </div>
              <div className="p-1">
                <SkeletonLoader
                  width={'100%'}
                  height={'3rem'}
                  radius={10}
                  circle={false}
                />
              </div>
              <div className="p-1">
                <SkeletonLoader
                  width={'100%'}
                  height={'3rem'}
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
        <div className="col-12">
          <div className="row g-2">
            <div className="col-12">
              <div className="p-1">
                <SkeletonLoader
                  width={'100%'}
                  height={'8rem'}
                  radius={10}
                  circle={false}
                />
              </div>
              <div className="p-1">
                <SkeletonLoader
                  width={'100%'}
                  height={'3rem'}
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
  { photoProfile, username, privilege }: PageData,
  password: string,
  passwordView: boolean,
  newPassword: string,
  newPasswordView: boolean,
  handleChangePassword: (value: string) => Promise<void>,
  handleClickPasswordView: () => Promise<void>,
  handleChangeNewPassword: (value: string) => Promise<void>,
  handleClickNewPasswordView: () => Promise<void>,
  handleClickChangePassword: () => Promise<void>,
  twofactor: boolean,
  twoFactorModalShow: boolean,
  twoFactorQRCode: string,
  handleTriggerTwoFactorModal: (show: boolean) => Promise<void>,
  twoFactorCode: string,
  handleChangeTwoFactorCode: (value: string) => Promise<void>,
  handleClickTwoFactorVerify: () => Promise<void>,
  handleClickTwoFactorDisable: () => Promise<void>,
) {
  return (
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
      <hr className="text-muted" />
      {compose_user_view_1(
        password,
        passwordView,
        newPassword,
        newPasswordView,
        handleChangePassword,
        handleClickPasswordView,
        handleChangeNewPassword,
        handleClickNewPasswordView,
        handleClickChangePassword,
        twoFactorModalShow,
        twofactor,
        twoFactorQRCode,
        twoFactorCode,
        handleTriggerTwoFactorModal,
        handleChangeTwoFactorCode,
        handleClickTwoFactorVerify,
        handleClickTwoFactorDisable
      )}
    </div>
  )
}

function compose_user_view_1(
  password: string,
  passwordView: boolean,
  newPassword: string,
  newPasswordView: boolean,
  handleChangePassword: (value: string) => Promise<void>,
  handleClickPasswordView: () => Promise<void>,
  handleChangeNewPassword: (value: string) => Promise<void>,
  handleClickNewPasswordView: () => Promise<void>,
  handleClickChangePassword: () => Promise<void>,
  twoFactorModalShow: boolean,
  twofactor: boolean,
  twoFactorQRCode: string,
  twoFactorCode: string,
  handleTriggerTwoFactorModal: (show: boolean) => Promise<void>,
  handleChangeTwoFactorCode: (value: string) => Promise<void>,
  handleClickTwoFactorVerify: () => Promise<void>,
  handleClickTwoFactorDisable: () => Promise<void>,
) {
  return (
    <div className="row gx-2">
      <div className="col-12 h-100">
        <div className="p-3 bg-primary bg-gradient rounded">
          <div className="d-flex bd-highlight">
            <div className="p-2 w-100 bd-highlight">
              <p className="text-start text-secondary fw-bold fs-5 my-2">
                Altera sua senha
              </p>
            </div>
            <div className="p-2 flex-shrink-1 bd-highlight my-2">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'lock')}
                className="ms-2 fs-3 flex-shrink-1 text-secondary my-auto"
              />
            </div>
          </div>
        </div>
        <div className="p-3 bg-light-gray rounded overflow-auto h-50">
          {compose_password_1(
            password,
            passwordView,
            newPassword,
            newPasswordView,
            handleChangePassword,
            handleClickPasswordView,
            handleChangeNewPassword,
            handleClickNewPasswordView
          )}
          {compose_password_2(newPassword, handleClickChangePassword)}
          {compose_password_3()}
        </div>
      </div>
      <hr />
      <div className="col-12 h-100">
        <div className="p-3 bg-primary bg-gradient rounded">
          <div className="d-flex bd-highlight">
            <div className="p-2 w-100 bd-highlight">
              <p className="text-start text-secondary fw-bold fs-5 my-2">
                Autenticação de duas etapas
              </p>
            </div>
            <div className="p-2 flex-shrink-1 bd-highlight my-2">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'user-shield')}
                className="ms-2 fs-3 flex-shrink-1 text-secondary my-auto"
              />
            </div>
          </div>
        </div>
        <div className="p-3 bg-light-gray rounded overflow-auto h-50">
          {compose_twoFactor(
            twoFactorModalShow,
            twofactor,
            twoFactorQRCode,
            twoFactorCode,
            handleTriggerTwoFactorModal,
            handleChangeTwoFactorCode,
            handleClickTwoFactorVerify,
            handleClickTwoFactorDisable
          )}
        </div>
      </div>
    </div>
  )
}

function compose_password_1(
  password: string,
  passwordView: boolean,
  newPassword: string,
  newPasswordView: boolean,
  handleChangePassword: (value: string) => Promise<void>,
  handleClickPasswordView: () => Promise<void>,
  handleChangeNewPassword: (value: string) => Promise<void>,
  handleClickNewPasswordView: () => Promise<void>,
) {
  const newPasswordDisabled = () => {
    if (password.length <= 0) return true
  }

  return (
    <div className="col-12 text-primary px-2">
      <div className="row gx-5">
        <div className="col-12">
          <div className="p-2">
            <div className="input-group">
              <span className="input-group-text" id="password-addon">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'key')}
                  className="ms-2 fs-3 flex-shrink-1 text-primary mx-2 my-auto"
                />
              </span>
              <input
                type={passwordView ? 'text' : 'password'}
                className="form-control"
                placeholder="Digite sua senha"
                aria-label="Password"
                aria-describedby="password-addon"
                value={password}
                onChange={(e) => handleChangePassword(e.target.value)}
              />
              <span className="input-group-text" id="passwordView-addon">
                <FontAwesomeIcon
                  icon={Icon.render('fas', passwordView ? 'low-vision' : 'eye')}
                  className="ms-2 fs-3 flex-shrink-1 mx-2 my-auto animation-delay hover-color"
                  onClick={handleClickPasswordView}
                />
              </span>
            </div>
            <div className="d-flex flex-column flex-md-row">
              <div className="col-12 col-md-10">
                <div className="form-text">
                  Informe sua senha antes de alterá-la.
                </div>
              </div>
              <div className="flex-shrink-1 col-12 col-md-2">
                <div className="form-text text-start text-md-end">
                  <a
                    href="/auth/password/forgot"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="p-2">
            <div className="input-group">
              <span className="input-group-text" id="newPassword-addon">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'key')}
                  className="ms-2 fs-3 flex-shrink-1 text-primary mx-2 my-auto"
                />
              </span>
              <input
                type={newPasswordView ? 'text' : 'password'}
                className="form-control"
                placeholder="Digite a nova senha"
                aria-label="New Password"
                aria-describedby="newPassword-addon"
                value={newPassword}
                onChange={(e) => handleChangeNewPassword(e.target.value)}
                disabled={newPasswordDisabled()}
              />
              <span className="input-group-text" id="newPasswordView-addon">
                <FontAwesomeIcon
                  icon={Icon.render(
                    'fas',
                    newPasswordView ? 'low-vision' : 'eye'
                  )}
                  className="ms-2 fs-3 flex-shrink-1 mx-2 my-auto animation-delay hover-color"
                  onClick={handleClickNewPasswordView}
                />
              </span>
            </div>
            <div className="form-text">
              Nunca compartilhe sua senha com ninguém.
            </div>
            <div className="form-text">
              Nós criptografamos sua senha para protegê-lo e esperamos que você
              também se proteja.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function compose_password_2(
  newPassword: string,
  handleClickChangePassword: () => Promise<void>
) {
  return (
    <div className="col-12 text-primary px-2">
      <div className="row gx-5">
        <div className="col-12">
          <div className="p-2">
            <button
              type="button"
              className="btn btn-outline-primary col-12"
              disabled={newPassword.length > 0 ? false : true}
              onClick={handleClickChangePassword}
            >
              Alterar senha
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function compose_password_3() {
  return (
    <div className="col-12 text-primary px-2">
      <div className="row gx-5">
        <div className="col-12">
          <div className="p-1">
            <small className="text-muted">
              A senha deve conter no mínimo 6 caracteres.
            </small>
          </div>
        </div>
        <div className="col-12">
          <div className="p-1">
            <small className="text-muted">
              A senha deve conter no máximo 256 caracteres.
            </small>
          </div>
        </div>
        <div className="col-12">
          <div className="p-1">
            <small className="text-muted">
              A senha deve conter no mínimo uma letra minúscula e maiúscula, um
              número e um caractere especial: $@#!
            </small>
          </div>
        </div>
        <div className="col-12">
          <div className="p-1">
            <small className="text-muted">
              A senha não deve conter nenhum desses caracteres especiais:{' '}
              {`=-()&¨"'\`{}?/-+.,;|%*`}
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}

function compose_twoFactor(
  twoFactorModalShow: boolean,
  twofactor: boolean,
  twoFactorQRCode: string,
  twoFactorCode: string,
  handleTriggerTwoFactorModal: (show: boolean) => Promise<void>,
  handleChangeTwoFactorCode: (value: string) => Promise<void>,
  handleClickTwoFactorVerify: () => Promise<void>,
  handleClickTwoFactorDisable: () => Promise<void>
) {
  return (
    <div className="my-1 text-primary">
      {twofactor ? (
        <button
          type="button"
          className="btn btn-primary col-12"
          onClick={handleClickTwoFactorDisable}
        >
          Desativar
        </button>
      ) : (
        <>
          <button
            type="button"
            className="btn btn-outline-primary col-12"
            onClick={() => handleTriggerTwoFactorModal(true)}
          >
            Ativar
          </button>
          <Modal
            show={twoFactorModalShow}
            onHide={() => handleTriggerTwoFactorModal(false)}
          >
            <Modal.Header
              className="bg-primary bg-gradient"
              closeButton={true}
              closeVariant={'white'}
            >
              <Modal.Title className="text-secondary fw-bold">
                Faça a leitura do seu QRCode
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='overflow-auto' style={{ height: '65vh' }}>
                {twoFactorQRCode.length > 0 ? (
                  <>
                    <div className="d-flex flex-column">
                      <Image
                        src={twoFactorQRCode}
                        alt="Escanei com seu aplicativo autenticador"
                        className="align-self-center"
                        width="350"
                        height="350"
                      />
                    </div>
                  </>
                ) : (
                  <p className="fw-bold">
                    Aguarde, enquanto geramos seu QRCode...
                  </p>
                )}
                <hr />
                <div className="input-group mb-3">
                  <span className="input-group-text" id="codeSecret-addon">
                    <FontAwesomeIcon
                      icon={Icon.render('fab', 'keycdn')}
                      className="ms-2 fs-3 flex-shrink-1 text-primary my-auto"
                    />
                  </span>
                  <input
                    type="phone"
                    className="form-control"
                    placeholder="Código de senha de uso único"
                    aria-label="Code Secret"
                    aria-describedby="codeSecret-addon"
                    value={twoFactorCode}
                    onChange={(e) => handleChangeTwoFactorCode(e.target.value)}
                  />
                </div>
                <p className="fw-bold">
                  Faça a leitura do seu QRCode usando um aplicativo autenticador.
                </p>
                <small>
                  Microsoft Authenticator, recomendado.
                  <br />
                  <a
                    href="https://play.google.com/store/apps/details?id=com.azure.authenticator&hl=pt_BR&gl=US"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Baixar pela Google Play
                  </a>
                  <br />
                  <a
                    href="https://apps.apple.com/br/app/microsoft-authenticator/id983156458"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Baixar pela Apple Store
                  </a>
                </small>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-primary col-12"
                disabled={twoFactorCode.length > 0 ? false : true}
                onClick={handleClickTwoFactorVerify}
              >
                Verificar
              </button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  )
}

export default function Security(
  {
    auth,
    getUserInfoAuthorization,
    authSignTwofactorAuthorization,
    authVerifyTwofactorAuthorization,
    authEnabledTwofactorAuthorization,
    authDisableTwofactorAuthorization,
    changePasswordAuthorization,
    hasConfiguredTwoFactorAuthorization,
  }: {
    auth: string,
    getUserInfoAuthorization: string,
    authSignTwofactorAuthorization: string,
    authVerifyTwofactorAuthorization: string,
    authEnabledTwofactorAuthorization: string,
    authDisableTwofactorAuthorization: string,
    changePasswordAuthorization: string,
    hasConfiguredTwoFactorAuthorization: string,
  }
) {
  const [isReady, setReady] = useState<boolean>(false)
  const [notAuth, setNotAuth] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [passwordView, setPasswordView] = useState<boolean>(false)
  const [newPassword, setNewPassword] = useState<string>('')
  const [newPasswordView, setNewPasswordView] = useState<boolean>(false)
  const [twoFactorModalShow, setTwoFactorModalShow] = useState<boolean>(false)
  const [twofactor, setTwofactor] = useState<boolean>(false)
  const [twoFactorQRCode, setTwoFactorQRCode] = useState<string>('')
  const [twoFactorCode, setTwoFactorCode] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

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
  const _fetch = useMemo(() => new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST!), []);

  const
    handleClickNoAuth: handleClickFunction = async (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      path: string
    ) => {
      event.preventDefault();
      if (path === '/auth/login')
        router.push(path);
    },
    handleChangePassword = async (value: string) => setPassword(value),
    handleChangeNewPassword = async (value: string) => setNewPassword(value),
    handleClickPasswordView = async () => setPasswordView(passwordView ? false : true),
    handleClickNewPasswordView = async () => setNewPasswordView(newPasswordView ? false : true),
    handleClickChangePassword = async () => {
      const test = checkPassword(newPassword)

      if (typeof test === 'string')
        return Alerting.create('warning', test)

      if (test) {
        const success = await changePassword(
          _fetch,
          auth,
          password,
          newPassword,
          changePasswordAuthorization
        );

        if (success) {
          Alerting.create('info', 'Senha alterada com sucesso!');
          setPassword('');
          setNewPassword('');
        } else {
          Alerting.create(
            'error',
            'Não foi possível alterar sua senha. Tente novamente!'
          );
        }
      }
    },
    handleClickTwoFactorSign = async () => {
      try {
        const { qrcode } = await authSignTwofactor(_fetch, auth, authSignTwofactorAuthorization);

        setTwoFactorQRCode(qrcode);

        return true;
      } catch (error) {
        return false;
      }
    },
    handleChangeTwoFactorCode = async (value: string) => setTwoFactorCode(value),
    handleClickTwoFactorVerify = async () => {
      const verifyTwofactor = await authVerifyTwofactor(
        _fetch,
        auth,
        twoFactorCode,
        authVerifyTwofactorAuthorization
      );

      if (verifyTwofactor) {
        const enabledTwofactor = await authEnabledTwofactor(_fetch, auth, authEnabledTwofactorAuthorization);

        if (enabledTwofactor) {
          Alerting.create('info', 'Sua autenticação de duas etapas está habilitada.');
          handleTriggerTwoFactorModal(false);
          setTwofactor(true);
        } else {
          Alerting.create(
            'error',
            'Não foi possível habilitar sua autenticação de duas etapas. Tente novamente!'
          );
        }
      } else {
        Alerting.create('error', 'Código invalido. Tente novamente!')
      }
    },
    handleClickTwoFactorDisable = async () => {
      const disableTwofactor = await authDisableTwofactor(_fetch, auth, authDisableTwofactorAuthorization);

      if (disableTwofactor) {
        Alerting.create('info', 'Sua autenticação de duas etapas foi desabilitada.');
        setTwofactor(false);
      } else {
        Alerting.create(
          'error',
          'Não foi possível desativar sua autenticação de duas etapas. Tente novamente!'
        );
      }
    },
    handleTriggerTwoFactorModal = async (show: boolean) => {
      if (show) await handleClickTwoFactorSign();

      setTwoFactorModalShow(show);
    };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const configuredTwofactor = await hasConfiguredTwoFactor(
        _fetch,
        auth,
        hasConfiguredTwoFactorAuthorization
      );

      if (configuredTwofactor)
        setTwofactor(success);
    });

    return () => clearTimeout(timeout);
  }, [_fetch, auth, hasConfiguredTwoFactorAuthorization, success]);

  if (error && !notAuth) {
    setNotAuth(true);
    setLoading(false);
  }

  if (success && data && !isReady) {
    setReady(true);
    setLoading(false);
  }

  if (loading) return compose_load()

  if (notAuth) return compose_noAuth(handleClickNoAuth)

  if (isReady && data)
    return compose_ready(
      { photoProfile: data.photoProfile, privilege: data.privilege, username: data.username },
      password,
      passwordView,
      newPassword,
      newPasswordView,
      handleChangePassword,
      handleClickPasswordView,
      handleChangeNewPassword,
      handleClickNewPasswordView,
      handleClickChangePassword,
      twofactor,
      twoFactorModalShow,
      twoFactorQRCode,
      handleTriggerTwoFactorModal,
      twoFactorCode,
      handleChangeTwoFactorCode,
      handleClickTwoFactorVerify,
      handleClickTwoFactorDisable
    )
}