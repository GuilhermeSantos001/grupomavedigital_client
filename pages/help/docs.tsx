/**
 * @description Documentação do sistema
 * @author GuilhermeSantos001
 * @update 25/01/2022
 */

interface Section {
  id: string
  title: string
  docs: Doc[]
}

interface Doc {
  id: string
  title: string
  contents: Content[]
  show: boolean
}

interface Content {
  id: string
  type: 'p'
  value: string
}

import Sugar from 'sugar'

import { PageProps } from '@/pages/_app'
import {GetMenuMain} from '@/bin/GetMenuMain'
import { Accordion } from 'react-bootstrap'

const staticProps: PageProps = {
  title: 'Documentação',
  description: 'Saiba mais sobre o funcionamento da nossa plataforma',
  themeColor: '#004a6e',
  menu: GetMenuMain('mn-helping')
},
  sections: Section[] = [
    {
      id: 'section-ss',
      title: 'Sessão & Segurança',
      docs: [
        {
          id: 'doc-cs',
          title: 'Conexões simultaneas',
          contents: [
            {
              id: 'cs-1',
              type: 'p',
              value: `A plataforma aceita até 4 conexões ao mesmo tempo.`,
            },
          ],
          show: false,
        },
        {
          id: 'doc-ts',
          title: 'Token de sessão',
          contents: [
            {
              id: 'ts-1',
              type: 'p',
              value: `
          Os tokens de segurança das sessões são usados para manter uma
          conexão segura com o servidor.
          `,
            },
            {
              id: 'ts-2',
              type: 'p',
              value: `
          Temos uma politica rígida quanto a utilização de tokens, para
          garantir sua segurança, por esse motivo não serão permitidos
          tokens compartilhados entre sessões e/ou usados em um endereço
          de IP diferente do originado.
          `,
            },
            {
              id: 'ts-3',
              type: 'p',
              value: `
          Seu token de segurança tem um tempo de validade de 15 minutos,
          para mantê-lo conectado por mais tempo, usamos um mecanismo de
          revalidação automática e transparente, que tem validade de 7 dias.
          `,
            },
          ],
          show: false,
        },
        {
          id: 'doc-twoFactor',
          title: 'Autenticação de duas etapas',
          contents: [
            {
              id: 'twoFactor-1',
              type: 'p',
              value: `
          Para mantê-lo ainda mais seguro, utilizamos um recurso de segurança
          de dois fatores, primeiro você efetua o pedido para logar, depois
          você deve confirmar a solicitação, através de um código secreto
          exclusivo em seu celular.
          `,
            },
            {
              id: 'twoFactor-2',
              type: 'p',
              value: `
          Caso você perca seu celular você poderá recuperar sua conta através
          do seu endereço de e-mail.
          `,
            },
            {
              id: 'twoFactor-3',
              type: 'p',
              value: `
          A ativação/desativação da autenticação de dois fatores é realizada
          nas configurações de segurança da sua conta.
          `,
            },
          ],
          show: false,
        },
      ],
    },
    {
      id: 'section-password-policy',
      title: 'Política de senhas',
      docs: [
        {
          id: 'ps-password-create',
          title: 'Criando uma senha',
          contents: [
            {
              id: 'password-create-1',
              type: 'p',
              value: `
              Para sua segurança estabelecemos requisitos para a definição de
              senhas na plataforma, visando aumentar ainda mais a segurança.
              `,
            },
            {
              id: 'password-create-2',
              type: 'p',
              value: `
              As senhas devem conter no mínimo 6 caracteres e no máximo 256 caracteres.
              `,
            },
            {
              id: 'password-create-3',
              type: 'p',
              value: `
              As senhas devem conter no mínimo uma letra minúscula e maiúscula, um número e um caractere especial: $@#!
              `,
            },
            {
              id: 'password-create-4',
              type: 'p',
              value: `
              As senhas não devem conter nenhum desses caracteres especiais: =-()&¨"'\`{}?/-+.,;|%*
              `,
            },
          ],
          show: false,
        },
        {
          id: 'ps-password-protect',
          title: 'Proteja sua senha',
          contents: [
            {
              id: 'password-protect-1',
              type: 'p',
              value: 'Não envie sua senha por mensagens.',
            },
            {
              id: 'password-protect-2',
              type: 'p',
              value: `
              Nossa equipe nunca irá pedir sua senha, pois não precisamos dessa
              informação. Para sua segurança nunca compartilhe sua senha com
              ninguém!
              `,
            },
          ],
          show: false,
        },
        {
          id: 'ps-password-save',
          title: 'Armazenamento de senhas',
          contents: [
            {
              id: 'password-save-1',
              type: 'p',
              value: `
              Nossa plataforma salva sua senha de forma criptografada.
              `,
            },
            {
              id: 'password-save-2',
              type: 'p',
              value: `
              Prefira utilizar um cofre online como onedrive ou norton, para
              armazenar suas informações críticas como sua senha.
              `,
            },
            {
              id: 'password-save-3',
              type: 'p',
              value: `
              Não utilize blocos de notas, anotações ou papeis para salvar sua
              senha.
              `,
            },
          ],
          show: false,
        },
      ],
    },
    {
      id: 'section-data-phishing',
      title: 'Cuidado com Phishing',
      docs: [
        {
          id: 'ps-data-phishing',
          title: 'Não solicitamos suas informações pessoais',
          contents: [
            {
              id: 'data-phishing-1',
              type: 'p',
              value: `
              Toda e qualquer informação pessoal que precisamos pedimos em seu
              cadastro em nossa plataforma.
              `,
            },
            {
              id: 'data-phishing-2',
              type: 'p',
              value: `
              Realizamos uma mudança de contrato sempre que ocorrer uma necessidade
              de armazenamento de uma nova informação pessoal dos nossos usuários.
              `,
            },
          ],
          show: false,
        },
        {
          id: 'ps-data-traffic',
          title: 'Não transitamos suas informações',
          contents: [
            {
              id: 'data-traffic-1',
              type: 'p',
              value: `
              Nosso sistema de cache só irá armazenar o necessário.
              `,
            },
            {
              id: 'data-traffic-2',
              type: 'p',
              value: `
              Caso alguém da nossa equipe solicite alguma informação pessoal
              a você, por mensagem e/ou telefone, ignore.
              `,
            },
          ],
          show: false,
        },
      ],
    },
    {
      id: 'section-integration-system',
      title: 'Integrações com nossa API',
      docs: [
        {
          id: 'ps-integration-system',
          title: 'Funcionamento da nossa API',
          contents: [
            {
              id: 'integration-system-1',
              type: 'p',
              value: `
              Nossa API utiliza o padrão REST, ou seja, você pode fazer requisições
              para a nossa API utilizando o protocolo HTTP. A API possui uma estrutura
              de rotas que são responsáveis por realizar as operações de CRUD. Além
              disso, a API possui uma estrutura de autenticação que é responsável por
              validar as chaves de acesso.
              `,
            },
            {
              id: 'integration-system-2',
              type: 'p',
              value: `
              Geração das chaves de acesso: Para gerar uma chave de acesso, você
              precisa ser um usuário com permissão de desenvolvedor e/ou administrador.
              `,
            },
          ],
          show: false,
        },
        {
          id: 'ps-integration-system-bills',
          title: 'Custos & Limites',
          contents: [
            {
              id: 'integration-system-bills-1',
              type: 'p',
              value: `
              Nossa API tem um custo de uso de R$ 15,00 por mês.
              `,
            },
            {
              id: 'integration-system-bills-2',
              type: 'p',
              value: `
              Por enquanto não temos nenhum limite de uso.
              `,
            }
          ],
          show: false,
        },
        {
          id: 'ps-integration-system-utilities',
          title: 'Por que utilizar nossa API?',
          contents: [
            {
              id: 'integration-system-utilities-1',
              type: 'p',
              value: `
              Você poderá executar chamadas a API para efetuar interações
              com o nosso sistema, como por exemplo: cadastrar um centro de custo,
              listar todos os centros de custo, editar um centro de custo, etc.
              A principal vantagem de se utilizar a API é que você pode usa-la
              com outro sistema e ter acesso a todas as informações que precisa
              de forma centralizada e integrada.
              `,
            }
          ],
          show: false,
        },
      ],
    },
  ]

export const getStaticProps = () => ({
  props: {
    ...staticProps,
    sections,
  },
})

function render_doc(index: number, parentID: string, doc: Doc) {
  const body = doc.contents.map((content) => {
    if (content.type === 'p') {
      return (
        <p key={content.id} className="border-bottom text-start p-2">
          {content.value}
        </p>
      )
    }
  })

  return (
    <Accordion.Item key={doc.id} eventKey={doc.id}>
      <Accordion.Header>
        {`${index + 1}) ${Sugar.String.capitalize(doc.title)}`}
      </Accordion.Header>
      <Accordion.Body>
        {body}
      </Accordion.Body>
    </Accordion.Item>
  )
}

export default function Docs({ sections }: { sections: Section[] }) {
   const docs = (section: Section, index: number) =>
      section.docs.map((doc: Doc, docIndex: number) =>
        render_doc(docIndex, `item-${index + 1}`, doc)
      ),
    contents = sections.map((section: Section, index: number) => {
      return (
        <div key={section.id} className="m-2">
          <div className="bg-primary bg-gradient text-secondary fw-bold rounded p-2">
            <p id={`item-${index + 1}`} className="text-center fs-5 my-2">
              {Sugar.String.capitalize(section.title)}
            </p>
          </div>
          <Accordion className="my-2" defaultActiveKey="0">
            {docs(section, index)}
          </Accordion>
        </div>
      )
    })

  return (
    <div
      data-testid="div-container"
      className="p-2"
      style={{ fontFamily: 'Fira Code' }}
    >
      <div className="d-flex justify-content-center px-5">
        <div className="bg-primary bg-gradient rounded position-relative col-12">
          <p className="text-center text-secondary fs-3 fw-bold p-2 my-2">
            Documentação
          </p>
        </div>
      </div>
      <hr className="text-muted" />
      <div
        data-bs-spy="scroll"
        data-bs-target="#navbar-summary"
        data-bs-offset="0"
        tabIndex={0}
      >
        {contents}
      </div>
    </div>
  )
}