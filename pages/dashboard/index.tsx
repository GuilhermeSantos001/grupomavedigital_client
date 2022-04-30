// /**
//  * @description Painéis do sistema
//  * @author GuilhermeSantos001
//  * @update 15/02/2022
//  */

// import React, { useEffect, useState } from 'react'

// import Link from 'next/link'

// import { useRouter } from 'next/router'

// import SkeletonLoader from 'tiny-skeleton-loader-react'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import Icon from '@/src/utils/fontAwesomeIcons'

// import NoPrivilege, { handleClickFunction } from '@/components/noPrivilege'
// import NoAuth from '@/components/noAuth'

// import { PageProps } from '@/pages/_app'
// import { GetMenuMain } from '@/bin/GetMenuMain'

// import { Variables } from '@/src/db/variables'
// import hasPrivilege from '@/src/functions/hasPrivilege'

// const serverSideProps: PageProps = {
//   title: 'System/Dashboard',
//   description: 'Painéis de gestão do Grupo Mave',
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
//                 style={{ marginTop: '0.1rem' }}
//               />
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
//             <div className="col-12 col-md-6">
//               <div className="p-1">
//                 <SkeletonLoader
//                   width={'100%'}
//                   height={'10rem'}
//                   radius={10}
//                   circle={false}
//                 />
//               </div>
//             </div>
//             <div className="col-12 col-md-6">
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
//           <div className="col-12 p-2">
//             <SkeletonLoader
//               width={'100%'}
//               height={'0.1rem'}
//               radius={0}
//               circle={false}
//             />
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
//       <div className="col-12 col-md-6">
//         <div className="p-3 bg-primary bg-gradient rounded">
//           <p className="text-center text-secondary fw-bold fs-5 my-2">
//             <FontAwesomeIcon
//               icon={Icon.render('fas', 'coins')}
//               className="me-1 fs-3 flex-shrink-1 text-secondary my-auto"
//             />
//             Financeiro
//           </p>
//         </div>
//         <div className="p-3 bg-light-gray rounded overflow-auto h-50">
//           <div className="my-1 text-primary">
//             <p className="text-center text-md-start px-2 fs-6 fw-bold">
//               <FontAwesomeIcon
//                 icon={Icon.render('fas', 'file-invoice-dollar')}
//                 className="me-1 flex-shrink-1 my-auto"
//               />
//               <Link href="/dashboard/finances/revenues">Faturamento</Link>
//             </p>
//             <hr />
//             <p className="text-center text-md-start px-2 fs-6 fw-bold">
//               <FontAwesomeIcon
//                 icon={Icon.render('fas', 'funnel-dollar')}
//                 className="me-1 flex-shrink-1 my-auto"
//               />
//               <Link href="/dashboard/finances/bills/receive">
//                 Contas a Receber
//               </Link>
//             </p>
//             <hr />
//           </div>
//         </div>
//       </div>
//       <div className="col-12 col-md-6">
//         <div className="p-3 bg-primary bg-gradient rounded">
//           <p className="text-center text-secondary fw-bold fs-5 my-2">
//             <FontAwesomeIcon
//               icon={Icon.render('fas', 'parachute-box')}
//               className="me-2 fs-3 flex-shrink-1 text-secondary my-auto"
//             />
//             Suprimentos
//           </p>
//         </div>
//         <div className="p-3 bg-light-gray rounded overflow-auto h-50">
//           <div className="my-1 text-muted">
//             <p className="text-center text-md-start px-2 fs-6 fw-bold">
//               <FontAwesomeIcon
//                 icon={Icon.render('fas', 'wrench')}
//                 className="me-1 flex-shrink-1 my-auto"
//               />
//               Estamos trabalhando nesse recurso.
//             </p>
//             <hr />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function Dashboard() {
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

//     useEffect(() => {
//       hasPrivilege('administrador')
//         .then((isAllowViewPage) => {
//           if (isAllowViewPage) {
//             setReady(true);
//           } else {
//             setNotPrivilege(true);
//           }

//           return setLoading(false);
//         })
//         .catch(() => {
//           setNotAuth(true);
//           return setLoading(false)
//         });
//     }, [])

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