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

export type Birthday = {
  __typename?: 'Birthday';
  day?: Maybe<Scalars['Int']>;
  month?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
};

export type CardInfo = {
  __typename?: 'CardInfo';
  cid?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  footer?: Maybe<Footer>;
  index?: Maybe<Scalars['String']>;
  jobtitle?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phones?: Maybe<Array<Maybe<Scalars['String']>>>;
  photo?: Maybe<Photo>;
  vcard?: Maybe<VCard>;
  version?: Maybe<Scalars['String']>;
  whatsapp?: Maybe<Whatsapp>;
};

export type Clients = {
  __typename?: 'Clients';
  filial: Scalars['String'];
  fullname: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  store: Scalars['String'];
};

export type File = {
  __typename?: 'File';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type Filial = {
  __typename?: 'Filial';
  cnpj: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
};

export type Footer = {
  __typename?: 'Footer';
  attachment?: Maybe<Photo>;
  email?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  socialmedia?: Maybe<Array<Maybe<Socialmedia>>>;
  website?: Maybe<Scalars['String']>;
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
  vcardCreate: VCardMetadata;
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
  data: Input_Card;
};


export type MutationCardRemoveArgs = {
  id: Scalars['String'];
};


export type MutationCardUpdateArgs = {
  data: Input_Card;
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
  data: Input_Vcard;
};

export type Photo = {
  __typename?: 'Photo';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
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
  cardGet: Array<CardInfo>;
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
   * Processa o pedido de alteração de senha da conta do usuário
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

export type SocialUrl = {
  __typename?: 'SocialURL';
  media?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type SocialUrls = {
  __typename?: 'SocialUrls';
  media?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type Socialmedia = {
  __typename?: 'Socialmedia';
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
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

export type VCard = {
  __typename?: 'VCard';
  birthday?: Maybe<Birthday>;
  city?: Maybe<Scalars['String']>;
  countryRegion?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstname?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  logo?: Maybe<Photo>;
  metadata?: Maybe<VCardMetadata>;
  organization?: Maybe<Scalars['String']>;
  photo?: Maybe<Photo>;
  postalCode?: Maybe<Scalars['String']>;
  socialUrls?: Maybe<Array<Maybe<SocialUrls>>>;
  stateProvince?: Maybe<Scalars['String']>;
  street?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  workPhone?: Maybe<Array<Maybe<Scalars['String']>>>;
  workUrl?: Maybe<Scalars['String']>;
};

export type VCardMetadata = {
  __typename?: 'VCardMetadata';
  file: VCardMetadataValues;
  logotipo: VCardMetadataValues;
  photo: VCardMetadataValues;
};

export type VCardMetadataValues = {
  __typename?: 'VCardMetadataValues';
  name: Scalars['String'];
  path: Scalars['String'];
  type: Scalars['String'];
};

export type Whatsapp = {
  __typename?: 'Whatsapp';
  message?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type Input_Birthday = {
  day: Scalars['Int'];
  month: Scalars['Int'];
  year: Scalars['Int'];
};

export type Input_Card = {
  footer: Input_CardFooter;
  id?: InputMaybe<Scalars['String']>;
  jobtitle: Scalars['String'];
  name: Scalars['String'];
  phones: Array<Scalars['String']>;
  photo: Input_File;
  vcard: Input_Vcard;
  version: Scalars['String'];
  whatsapp: Input_Whatsapp;
};

export type Input_CardFooter = {
  attachment: Input_File;
  email: Scalars['String'];
  location: Scalars['String'];
  socialmedia: Array<Input_Socialmedia>;
  website: Scalars['String'];
};

export type Input_File = {
  id: Scalars['String'];
  name: Scalars['String'];
  type: Scalars['String'];
};

export type Input_SocialUrl = {
  media: Scalars['String'];
  url: Scalars['String'];
};

export type Input_Socialmedia = {
  enabled: Scalars['Boolean'];
  name: Scalars['String'];
  value: Scalars['String'];
};

export type Input_Vcard = {
  birthday: Input_Birthday;
  city: Scalars['String'];
  countryRegion: Scalars['String'];
  email: Scalars['String'];
  firstname: Scalars['String'];
  label: Scalars['String'];
  lastname: Scalars['String'];
  logo: Input_File;
  metadata?: InputMaybe<Input_Vcardmetadata>;
  organization: Scalars['String'];
  photo: Input_File;
  postalCode: Scalars['String'];
  socialUrls: Array<Input_SocialUrl>;
  stateProvince: Scalars['String'];
  street: Scalars['String'];
  title: Scalars['String'];
  url: Scalars['String'];
  workPhone: Array<Scalars['String']>;
  workUrl: Scalars['String'];
};

export type Input_Vcardmetadata = {
  file: Input_Vcardmetadavalues;
  logotipo: Input_Vcardmetadavalues;
  photo: Input_Vcardmetadavalues;
};

export type Input_Vcardmetadavalues = {
  name: Scalars['String'];
  path: Scalars['String'];
  type: Scalars['String'];
};

export type Input_Whatsapp = {
  message: Scalars['String'];
  phone: Scalars['String'];
  text: Scalars['String'];
};

export type CardCreateMutationVariables = Exact<{
  data: Input_Card;
}>;


export type CardCreateMutation = { __typename?: 'Mutation', cardCreate: string };

export type VCardCreateMutationVariables = Exact<{
  data: Input_Vcard;
}>;


export type VCardCreateMutation = { __typename?: 'Mutation', vcardCreate: { __typename?: 'VCardMetadata', file: { __typename?: 'VCardMetadataValues', path: string, name: string, type: string }, logotipo: { __typename?: 'VCardMetadataValues', path: string, name: string, type: string }, photo: { __typename?: 'VCardMetadataValues', path: string, name: string, type: string } } };

export type CardGetQueryVariables = Exact<{
  lastIndex?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
}>;


export type CardGetQuery = { __typename?: 'Query', cardGet: Array<{ __typename?: 'CardInfo', index?: string | null, cid?: string | null, version?: string | null, name?: string | null, jobtitle?: string | null, phones?: Array<string | null> | null, createdAt?: string | null, photo?: { __typename?: 'Photo', name?: string | null, type?: string | null, id?: string | null } | null, whatsapp?: { __typename?: 'Whatsapp', phone?: string | null, text?: string | null, message?: string | null } | null, vcard?: { __typename?: 'VCard', firstname?: string | null, lastname?: string | null, organization?: string | null, workPhone?: Array<string | null> | null, title?: string | null, url?: string | null, workUrl?: string | null, email?: string | null, label?: string | null, countryRegion?: string | null, street?: string | null, city?: string | null, stateProvince?: string | null, postalCode?: string | null, photo?: { __typename?: 'Photo', name?: string | null, type?: string | null, id?: string | null } | null, logo?: { __typename?: 'Photo', name?: string | null, type?: string | null, id?: string | null } | null, birthday?: { __typename?: 'Birthday', year?: number | null, month?: number | null, day?: number | null } | null, socialUrls?: Array<{ __typename?: 'SocialUrls', media?: string | null, url?: string | null } | null> | null, metadata?: { __typename?: 'VCardMetadata', file: { __typename?: 'VCardMetadataValues', path: string, name: string, type: string }, logotipo: { __typename?: 'VCardMetadataValues', path: string, name: string, type: string }, photo: { __typename?: 'VCardMetadataValues', path: string, name: string, type: string } } | null } | null, footer?: { __typename?: 'Footer', email?: string | null, location?: string | null, website?: string | null, attachment?: { __typename?: 'Photo', name?: string | null, type?: string | null, id?: string | null } | null, socialmedia?: Array<{ __typename?: 'Socialmedia', name?: string | null, value?: string | null } | null> | null } | null }> };

export type GetUserInfoQueryVariables = Exact<{
  auth: Scalars['String'];
}>;


export type GetUserInfoQuery = { __typename?: 'Query', getUserInfo: { __typename?: 'UserInfo', privileges: Array<string>, privilege: string, photoProfile: string, username: string, email: string, name: string, surname: string, cnpj: string, location: { __typename?: 'Location', street: string, number: number, complement: string, district: string, state: string, city: string, zipcode: string } } };


export const CardCreateDocument = gql`
    mutation CardCreate($data: input_card!) {
  cardCreate(data: $data)
}
    `;
export const VCardCreateDocument = gql`
    mutation VCardCreate($data: input_vcard!) {
  vcardCreate(data: $data) {
    file {
      path
      name
      type
    }
    logotipo {
      path
      name
      type
    }
    photo {
      path
      name
      type
    }
  }
}
    `;
export const CardGetDocument = gql`
    query CardGet($lastIndex: String, $limit: Int!) {
  cardGet(lastIndex: $lastIndex, limit: $limit) {
    index
    cid
    version
    photo {
      name
      type
      id
    }
    name
    jobtitle
    phones
    whatsapp {
      phone
      text
      message
    }
    vcard {
      firstname
      lastname
      organization
      photo {
        name
        type
        id
      }
      logo {
        name
        type
        id
      }
      workPhone
      birthday {
        year
        month
        day
      }
      title
      url
      workUrl
      email
      label
      countryRegion
      street
      city
      stateProvince
      postalCode
      socialUrls {
        media
        url
      }
      metadata {
        file {
          path
          name
          type
        }
        logotipo {
          path
          name
          type
        }
        photo {
          path
          name
          type
        }
      }
    }
    footer {
      email
      location
      website
      attachment {
        name
        type
        id
      }
      socialmedia {
        name
        value
      }
    }
    createdAt
  }
}
    `;
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