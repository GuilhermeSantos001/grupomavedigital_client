import Image from 'next/image'

import { PageProps } from '@/pages/_app'
import { GetMenuHome } from '@/bin/GetMenuHome'

const staticProps: PageProps = {
  title: 'Grupo Mave Digital',
  description: 'Pagina não Encontrada!',
  themeColor: '#004a6e',
  menu: GetMenuHome('mn-home'),
  fullwidth: true
}

export const getStaticProps = () => ({
  props: staticProps, // will be passed to the page component as props
})

export default function Page404() {
  return (
    <div
      className="p-2"
      style={{ fontFamily: 'Fira Code' }}
    >
      <h1 className="fw-bold">
        Pagina não encontrada!
      </h1>
      <hr className="text-muted" />
      <div className="col-12 p-2">
        <div className="card shadow">
          <Image
            className="cursor-pointer card-img-top border border-primary"
            src="/images/404.jpg"
            priority={true}
            alt={`Navegando no espaço`}
            width={1920}
            height={1080}
          />
          <div
            className="card-body bg-primary bg-gradient text-secondary overflow-auto"
            style={{ height: '10rem' }}
          >
            <h5 className="card-title">
              Parece que você está perdido!
            </h5>
            <hr className="text-white" />
            <p className="card-text text-white fs-6">
              Não encontramos a página que você está procurando. Tente navegar
              novamente usando o menu lateral. Clique na nossa logo para voltar
              a página inicial.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}