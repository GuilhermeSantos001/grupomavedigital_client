import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Integer custom scalar type */
  BigInt: any;
  /** Date custom scalar type */
  Date: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type AuthInfo = {
  __typename?: 'AuthInfo';
  authorization: Scalars['ID'];
  email: Scalars['String'];
  name: Scalars['String'];
  privileges: Array<Scalars['String']>;
  refreshToken: RefreshToken;
  signature: Scalars['String'];
  token: Scalars['String'];
  username: Scalars['String'];
};

export type AuthSignTwoFactor = {
  __typename?: 'AuthSignTwoFactor';
  qrcode: Scalars['String'];
};

export type Banking = {
  __typename?: 'Banking';
  account: Scalars['String'];
  accountDigit: Scalars['String'];
  agency: Scalars['String'];
  agencyDigit: Scalars['String'];
  filial: Scalars['String'];
  fullname: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
};

export type BankingNatures = {
  __typename?: 'BankingNatures';
  account: Scalars['String'];
  description: Scalars['String'];
  filial: Scalars['String'];
  id: Scalars['String'];
};

export type BillsReceive = {
  __typename?: 'BillsReceive';
  balanceValue: Scalars['BigInt'];
  bankingNature: Scalars['String'];
  client: BillsReceiveClient;
  expectedExpiration: Scalars['String'];
  finished: Scalars['String'];
  grossValue: Scalars['BigInt'];
  liquidValue: Scalars['BigInt'];
  num: Scalars['String'];
  parcel: Scalars['String'];
  prefix: Scalars['String'];
  realExpiration: Scalars['String'];
  released: Scalars['String'];
  taxes: BillsReceiveTaxes;
  type: Scalars['String'];
};

export type BillsReceiveClient = {
  __typename?: 'BillsReceiveClient';
  id: Scalars['String'];
  name: Scalars['String'];
  store: Scalars['String'];
};

export type BillsReceiveTaxes = {
  __typename?: 'BillsReceiveTaxes';
  COFINS: Scalars['String'];
  CSLL: Scalars['String'];
  INSS: Scalars['String'];
  IRRF: Scalars['String'];
  ISS: Scalars['String'];
  PIS: Scalars['String'];
};

export type BillsType = {
  __typename?: 'BillsType';
  description: Scalars['String'];
  filial: Scalars['String'];
  key: Scalars['String'];
};

export type Clients = {
  __typename?: 'Clients';
  filial: Scalars['String'];
  fullname: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  store: Scalars['String'];
};

export type Filial = {
  __typename?: 'Filial';
  cnpj: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
};

export type InputRefreshToken = {
  signature: Scalars['String'];
  value: Scalars['String'];
};

export type Location = {
  __typename?: 'Location';
  city: Scalars['String'];
  complement: Scalars['String'];
  district: Scalars['String'];
  number: Scalars['Int'];
  state: Scalars['String'];
  street: Scalars['String'];
  zipcode: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Desativa a verificação de duas etapas da conta do usuário
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/users-mutations?id=authdisabletwofactor
   */
  authDisableTwofactor: Scalars['Boolean'];
  /**
   * Ativa a verificação de duas etapas da conta do usuário
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/users-mutations?id=authenabledtwofactor
   */
  authEnabledTwofactor: Scalars['Boolean'];
  /**
   * Recuperação da conta, caso perca o gerador de códigos para a verificação de duas etapas da conta do usuário
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/users-mutations?id=authretrievetwofactor
   */
  authRetrieveTwofactor: Scalars['String'];
  /**
   * Gera um QRCode para ativação da verificação de duas etapas da conta do usuário
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/users-mutations?id=authsigntwofactor
   */
  authSignTwofactor: AuthSignTwoFactor;
  /**
   * Verifica o código da verificação de duas etapas da conta do usuário
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/users-mutations?id=authverifytwofactor
   */
  authVerifyTwofactor: Scalars['Boolean'];
  /**
   * Cria um novo cartão digital
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/cards-mutations?id=cardcreate
   */
  cardCreate: Scalars['String'];
  /**
   * Remove um cartão digital
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/cards-mutations?id=cardremove
   */
  cardRemove: Scalars['Boolean'];
  /**
   * Atualiza um cartão digital
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/cards-mutations?id=cardupdate
   */
  cardUpdate: Scalars['String'];
  /**
   * Altera a senha do usuário
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/users-mutations?id=changepassword
   */
  changePassword: Scalars['Boolean'];
  /**
   * Verifica se a autenticação de duas etapas está configurada
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/users-mutations?id=hasconfiguredtwofactor
   */
  hasConfiguredTwoFactor: Scalars['Boolean'];
  multipleUpload: Array<UploadFIle>;
  /**
   * Registra um novo usuário
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/users-mutations?id=registeruser
   */
  registerUser: Scalars['String'];
  singleUpload: UploadFIle;
  /**
   * Atualiza os dados do usuário
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/users-mutations?id=updatedata
   */
  updateData: Scalars['Boolean'];
  /**
   * Atualiza a foto de perfil do usuário
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/users-mutations?id=updatephotoprofile
   */
  updatePhotoProfile: Scalars['Boolean'];
  /**
   * Cria um novo vcard
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/cards-mutations?id=vcardcreate
   */
  vcardCreate: Scalars['String'];
};


export type MutationAuthDisableTwofactorArgs = {
  auth: Scalars['String'];
};


export type MutationAuthEnabledTwofactorArgs = {
  auth: Scalars['String'];
};


export type MutationAuthRetrieveTwofactorArgs = {
  auth: Scalars['String'];
};


export type MutationAuthSignTwofactorArgs = {
  auth: Scalars['String'];
};


export type MutationAuthVerifyTwofactorArgs = {
  auth: Scalars['String'];
  qrcode: Scalars['String'];
};


export type MutationCardCreateArgs = {
  data: Card;
};


export type MutationCardRemoveArgs = {
  id: Scalars['String'];
};


export type MutationCardUpdateArgs = {
  data: Card;
};


export type MutationChangePasswordArgs = {
  auth: Scalars['String'];
  new_pwd: Scalars['String'];
  pwd: Scalars['String'];
};


export type MutationHasConfiguredTwoFactorArgs = {
  auth: Scalars['String'];
};


export type MutationMultipleUploadArgs = {
  auth: Scalars['String'];
  files: Array<Scalars['Upload']>;
  randomName: Scalars['Boolean'];
  signedUrl: Scalars['String'];
  sizes: Array<Scalars['String']>;
};


export type MutationRegisterUserArgs = {
  authorization: Scalars['String'];
  cnpj: Scalars['String'];
  email: Scalars['String'];
  location: Array<Scalars['String']>;
  name: Scalars['String'];
  password: Scalars['String'];
  photoProfile?: InputMaybe<Scalars['String']>;
  privileges: Array<Scalars['String']>;
  surname: Scalars['String'];
  username: Scalars['String'];
};


export type MutationSingleUploadArgs = {
  auth: Scalars['String'];
  file: Scalars['Upload'];
  randomName: Scalars['Boolean'];
  signedUrl: Scalars['String'];
  size: Scalars['String'];
};


export type MutationUpdateDataArgs = {
  auth: Scalars['String'];
  cnpj: Scalars['String'];
  email: Scalars['String'];
  location: Array<Scalars['String']>;
  name: Scalars['String'];
  surname: Scalars['String'];
  username: Scalars['String'];
};


export type MutationUpdatePhotoProfileArgs = {
  auth: Scalars['String'];
  photo: Scalars['String'];
};


export type MutationVcardCreateArgs = {
  data: Vcard;
};

export type Query = {
  __typename?: 'Query';
  /**
   * Envia o e-mail para recuperar a conta do usuário caso ele esqueca a senha
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/users-query?id=authforgotpassword
   */
  authForgotPassword: Scalars['Boolean'];
  /**
   * Efetua o login do usuário
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/users-query?id=authlogin
   */
  authLogin: AuthInfo;
  /**
   * Efetua o logout do usuário
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/users-query?id=authlogout
   */
  authLogout: Scalars['Boolean'];
  /**
   * Efetua o login do usuário
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/cards-query?id=cardget
   */
  cardGet: Scalars['String'];
  /**
   * Dados do Painel de "Contas a Receber"
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/dashboards-query?id=dashboardreceive
   */
  dashboardReceive: Array<Maybe<BillsReceive>>;
  /**
   * Dados do Painel de "Faturamento"
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/dashboards-query?id=dashboardrevenues
   */
  dashboardRevenues: Array<Maybe<Revenues>>;
  /**
   * Dados dos bancos
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/data-query?id=databanking
   */
  dataBanking: Array<Maybe<Banking>>;
  /**
   * Dados das naturezas bancarias
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/data-query?id=databankingnatures
   */
  dataBankingNatures: Array<Maybe<BankingNatures>>;
  /**
   * Dados dos tipos de titulos
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/data-query?id=databillstype
   */
  dataBillsType: Array<Maybe<BillsType>>;
  /**
   * Dados dos Clientes
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/data-query?id=dataclients
   */
  dataClients: Array<Maybe<Clients>>;
  /**
   * Dados das Filiais
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/data-query?id=datafilial
   */
  dataFilial: Array<Maybe<Filial>>;
  /**
   * Envia o e-mail de confirmação da conta do usuário
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/users-query?id=emailresendconfirm
   */
  emailResendConfirm: Scalars['Boolean'];
  /**
   * Retorna as informações do usuário
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/users-query?id=getuserinfo
   */
  getUserInfo: UserInfo;
  /**
   * Processa o pedido de confirmação da conta do usuário
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/users-query?id=mailconfirm
   */
  mailConfirm: Scalars['Boolean'];
  /**
   * Processa o pedido de alteração de senha da conta do usuario
   * Docs: https://grupomavedigital-wiki.vercel.app/#/graphql/users-query?id=processorderforgotpassword
   */
  processOrderForgotPassword: Scalars['Boolean'];
};


export type QueryAuthForgotPasswordArgs = {
  auth: Scalars['String'];
};


export type QueryAuthLoginArgs = {
  auth: Scalars['String'];
  pwd: Scalars['String'];
  twofactortoken?: InputMaybe<Scalars['String']>;
};


export type QueryAuthLogoutArgs = {
  auth: Scalars['String'];
  signature: Scalars['String'];
  token: Scalars['String'];
};


export type QueryCardGetArgs = {
  lastIndex?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryDashboardReceiveArgs = {
  bankingNature?: InputMaybe<Scalars['String']>;
  cache?: InputMaybe<Scalars['Boolean']>;
  client?: InputMaybe<Scalars['String']>;
  filial?: InputMaybe<Scalars['String']>;
  period: Array<Scalars['String']>;
  store?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryDashboardRevenuesArgs = {
  cache?: InputMaybe<Scalars['Boolean']>;
  client?: InputMaybe<Scalars['String']>;
  filial?: InputMaybe<Scalars['String']>;
  period: Array<Scalars['String']>;
  store?: InputMaybe<Scalars['String']>;
};


export type QueryDataBankingArgs = {
  cache?: InputMaybe<Scalars['Boolean']>;
};


export type QueryDataBankingNaturesArgs = {
  cache?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['String']>;
};


export type QueryDataBillsTypeArgs = {
  cache?: InputMaybe<Scalars['Boolean']>;
};


export type QueryDataClientsArgs = {
  cache?: InputMaybe<Scalars['Boolean']>;
  filial?: InputMaybe<Scalars['String']>;
};


export type QueryDataFilialArgs = {
  cache?: InputMaybe<Scalars['Boolean']>;
};


export type QueryEmailResendConfirmArgs = {
  auth: Scalars['String'];
};


export type QueryGetUserInfoArgs = {
  auth: Scalars['String'];
};


export type QueryMailConfirmArgs = {
  token: Scalars['String'];
};


export type QueryProcessOrderForgotPasswordArgs = {
  pwd: Scalars['String'];
  signature: Scalars['String'];
  token: Scalars['String'];
};

export type RefreshToken = {
  __typename?: 'RefreshToken';
  expiry: Scalars['Date'];
  signature: Scalars['String'];
  value: Scalars['String'];
};

export type Revenues = {
  __typename?: 'Revenues';
  client: Scalars['String'];
  released: Scalars['String'];
  store: Scalars['String'];
  value: Scalars['BigInt'];
};

export type UploadFIle = {
  __typename?: 'UploadFIle';
  authorId: Scalars['String'];
  compressedSize: Scalars['Int'];
  fileId: Scalars['String'];
  name: Scalars['String'];
  size: Scalars['Int'];
  status: Scalars['String'];
  version: Scalars['Int'];
};

export type UserInfo = {
  __typename?: 'UserInfo';
  cnpj: Scalars['String'];
  email: Scalars['String'];
  location: Location;
  name: Scalars['String'];
  photoProfile: Scalars['String'];
  privilege: Scalars['String'];
  privileges: Array<Scalars['String']>;
  surname: Scalars['String'];
  username: Scalars['String'];
};

export type Birthday = {
  day: Scalars['Int'];
  month: Scalars['Int'];
  year: Scalars['Int'];
};

export type Card = {
  footer: CardFooter;
  id?: InputMaybe<Scalars['String']>;
  jobtitle: Scalars['String'];
  name: Scalars['String'];
  phones: Array<Scalars['String']>;
  photo: File;
  vcard: Vcard;
  version: Scalars['String'];
  whatsapp: Whatsapp;
};

export type CardFooter = {
  attachment: Scalars['String'];
  email: Scalars['String'];
  location: Scalars['String'];
  socialmedia: Array<Socialmedia>;
  website: Scalars['String'];
};

export type File = {
  name: Scalars['String'];
  path: Scalars['String'];
};

export type SocialUrl = {
  media: Scalars['String'];
  url: Scalars['String'];
};

export type Socialmedia = {
  enabled: Scalars['Boolean'];
  name: Scalars['String'];
  value: Scalars['String'];
};

export type Vcard = {
  birthday: Birthday;
  city: Scalars['String'];
  countryRegion: Scalars['String'];
  email: Scalars['String'];
  file?: InputMaybe<File>;
  firstname: Scalars['String'];
  label: Scalars['String'];
  lastname: Scalars['String'];
  logo: File;
  organization: Scalars['String'];
  photo: File;
  postalCode: Scalars['String'];
  socialUrls: Array<SocialUrl>;
  stateProvince: Scalars['String'];
  street: Scalars['String'];
  title: Scalars['String'];
  url: Scalars['String'];
  workPhone: Array<Scalars['String']>;
  workUrl: Scalars['String'];
};

export type Whatsapp = {
  message: Scalars['String'];
  phone: Scalars['String'];
  text: Scalars['String'];
};

export type GetUserInfoQueryVariables = Exact<{
  auth: Scalars['String'];
}>;


export type GetUserInfoQuery = { __typename?: 'Query', getUserInfo: { __typename?: 'UserInfo', privileges: Array<string>, privilege: string, photoProfile: string, username: string, email: string, name: string, surname: string, cnpj: string, location: { __typename?: 'Location', street: string, number: number, complement: string, district: string, state: string, city: string, zipcode: string } } };


export const GetUserInfoDocument = gql`
    query GetUserInfo($auth: String!) {
  getUserInfo(auth: $auth) {
    privileges
    privilege
    photoProfile
    username
    email
    name
    surname
    cnpj
    location {
      street
      number
      complement
      district
      state
      city
      zipcode
    }
  }
}
    `;