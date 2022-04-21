import Image from 'next/image'

import { PageProps } from '@/pages/_app'
import { GetMenuHome } from '@/bin/GetMenuHome'

const staticProps: PageProps = {
  title: 'Grupo Mave Digital',
  description: 'Bem-vindo(a) ao ambiente digital interativo do Grupo Mave!',
  themeColor: '#004a6e',
  menu: GetMenuHome('mn-home'),
}

export const getStaticProps = () => ({
  props: staticProps, // will be passed to the page component as props
})

export default function Home() {
  return (
    <div
      data-testid="div-container"
      className="p-2"
      style={{ fontFamily: 'Fira Code' }}
    >
      <h1 data-testid="text-start" className="fw-bold text-primary">
        Bem-Vindo(a)
      </h1>
      <hr data-testid="separator" className="text-muted" />
      <div data-testid="container-card-1" className="col-12 p-2">
        <div data-testid="card-image-1" className="card shadow">
          <Image
            data-testid="image-1"
            className="cursor-pointer card-img-top border border-primary"
            src="/images/tecnologia_e_inovacao.jpg"
            priority={true}
            alt={`Tecnologia ${`&`} Inovação`}
            width={1920}
            height={1080}
          />
          <div
            data-testid="card-body-1"
            className="card-body bg-primary bg-gradient text-secondary overflow-auto"
            style={{ height: '10rem' }}
          >
            <h5 data-testid="card-body-1-title" className="card-title">
              Nosso principal objetivo com essa renovação digital é integrar o que
              temos de mais importante, você!
            </h5>
            <hr data-testid="card-separator-1" className="text-white" />
            <p data-testid="card-text-1" className="card-text text-white fs-6">
              Graças as inovações tecnológicas agora podemos estar ainda mais
              próximos de nossos clientes e colaboradores.
            </p>
          </div>
        </div>
      </div>
      <div
        data-testid="container-card-2"
        className="d-flex flex-column flex-md-row"
      >
        <div data-testid="card-2-col-1" className="col-12 col-md-6 p-2">
          <div data-testid="card-2-1" className="card shadow">
            <Image
              data-testid="image-2-1"
              className="cursor-pointer card-img-top border border-primary"
              src="/images/notebook.jpg"
              priority={true}
              alt="Notebook"
              width={1920}
              height={1080}
            />
            <div
              data-testid="card-2-body-1"
              className="card-body bg-primary bg-gradient text-secondary overflow-auto"
              style={{ height: '10rem' }}
            >
              <h5 data-testid="card-2-title-1" className="card-title">
                Use como preferir
              </h5>
              <hr data-testid="card-2-separator-1" className="text-white" />
              <p
                data-testid="card-2-text-1"
                className="card-text text-white fs-6"
              >
                O ambiente digital interativo foi pensado para ser flexível, você
                pode usar pelo computador, tablet ou smartphone.
              </p>
            </div>
          </div>
        </div>
        <div data-testid="card-2-col-2" className="col-12 col-md-6 p-2">
          <div data-testid="card-2-2" className="card shadow">
            <Image
              data-testid="image-2-2"
              className="cursor-pointer card-img-top border border-primary"
              src="/images/aula_online.jpg"
              priority={true}
              alt="Aula Online"
              width={1920}
              height={1080}
            />
            <div
              data-testid="card-2-body-2"
              className="card-body bg-primary bg-gradient text-secondary overflow-auto"
              style={{ height: '10rem' }}
            >
              <h5 data-testid="card-2-title-2" className="card-title">
                Capacita-se conosco
              </h5>
              <hr data-testid="card-2-separator-2" className="text-white" />
              <p
                data-testid="card-2-text-2"
                className="card-text text-white fs-6"
              >
                Seja você um entusiasta ou um profissional do segmento, temos
                cursos para você aumentar suas habilidades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}