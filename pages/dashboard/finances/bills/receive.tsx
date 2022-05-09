// /**
//  * @description Dashboard de "Contas a Receber"
//  * @author GuilhermeSantos001
//  * @update 14/02/2022
//  */

// import React, { useEffect, useState } from 'react'

// import { useRouter } from 'next/router'

// import SkeletonLoader from 'tiny-skeleton-loader-react'

// import NoPrivilege, { handleClickFunction } from '@/components/noPrivilege'
// import NoAuth from '@/components/noAuth'
// import ChartBillsReceive from '@/components/charts/chartBillsReceive'

// import { PageProps } from '@/pages/_app'
// import { GetMenuMain } from '@/bin/GetMenuMain'

// import Fetch from '@/src/utils/fetch'
// import { Variables } from '@/src/db/variables'
// import hasPrivilege from '@/src/functions/hasPrivilege'

// const serverSideProps: PageProps = {
//   title: 'Dashboard/Contas a Receber',
//   description: 'Gestão há vista de contas a receber',
//   themeColor: '#004a6e',
//   menu: GetMenuMain('mn-dashboard')
// }

// export const getServerSideProps = async () => {
//   return {
//     props: {
//       ...serverSideProps,
//     },
//   }
// }

// function compose_load() {
//   return (
//     <div>
//       <div className="d-block d-md-none">
//         <div className="col-12">
//           <div className="d-flex flex-column p-2">
//             <div className="col-12 px-2">
//               <SkeletonLoader
//                 width={'100%'}
//                 height={'10rem'}
//                 radius={10}
//                 circle={false}
//                 style={{ marginTop: '1rem' }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="d-none d-md-flex">
//         <div className="col-12">
//           <div className="row g-2">
//             <div className="col-12">
//               <div className="p-1">
//                 <SkeletonLoader
//                   width={'100%'}
//                   height={'10rem'}
//                   radius={10}
//                   circle={false}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// function compose_noPrivilege(handleClick: handleClickFunction) {
//   return <NoPrivilege handleClick={handleClick} />
// }

// function compose_noAuth(handleClick: handleClickFunction) {
//   return <NoAuth handleClick={handleClick} />
// }

// function compose_ready() {
//   return (
//     <div className="row g-2">
//       <div className="col-12">
//         <div className="p-3 bg-primary bg-gradient rounded">
//           <h1 className="text-center text-secondary fw-bold my-2">
//             Contas a Receber
//           </h1>
//         </div>
//         <div className="p-3 bg-light-gray rounded">
//           <ChartBillsReceive
//             fetch={new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST)}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function Receive() {
//   const [isReady, setReady] = useState<boolean>(false)
//   const [notPrivilege, setNotPrivilege] = useState<boolean>(false)
//   const [notAuth, setNotAuth] = useState<boolean>(false)
//   const [loading, setLoading] = useState<boolean>(true)

//   const router = useRouter()

//   const
//     handleClickNoAuth: handleClickFunction = async (
//       event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
//       path: string
//     ) => {
//       event.preventDefault()

//       if (path === '/auth/login') {
//         const variables = new Variables(1, 'IndexedDB')
//         await Promise.all([await variables.clear()]).then(() => {
//           router.push(path)
//         })
//       }
//     },
//     handleClickNoPrivilege: handleClickFunction = async (
//       event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
//       path: string
//     ) => {
//       event.preventDefault()
//       router.push(path)
//     };

//   useEffect(() => {
//     hasPrivilege('administrador')
//       .then((isAllowViewPage) => {
//         if (isAllowViewPage) {
//           setReady(true);
//         } else {
//           setNotPrivilege(true);
//         }

//         return setLoading(false);
//       })
//       .catch(() => {
//         setNotAuth(true);
//         return setLoading(false)
//       });
//   }, [])

//   if (loading) return compose_load()

//   if (notPrivilege) return compose_noPrivilege(handleClickNoPrivilege)

//   if (notAuth) return compose_noAuth(handleClickNoAuth)

//   if (isReady) return compose_ready()
// }

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