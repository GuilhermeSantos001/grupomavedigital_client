/**
 * @description Componentes de loading
 * @author @GuilhermeSantos001
 * @update 22/09/2021
 * @version 1.0.0
 */

import React from 'react'

import myLoading from '@/src/utils/loading'

export default class Loading extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const win: any = window

    const renderLoad = () => {
        myLoading.start()

        win.loading_screen = win.pleaseWait({
          logo: '',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          loadingHtml: ` \
          <div class="d-flex flex-column" style="margin-top: -10rem;"> \
              <div class="sk-cube-grid align-self-center"> \
                  <div class="sk-cube sk-cube1"></div> \
                  <div class="sk-cube sk-cube2"></div> \
                  <div class="sk-cube sk-cube3"></div> \
                  <div class="sk-cube sk-cube4"></div> \
                  <div class="sk-cube sk-cube5"></div> \
                  <div class="sk-cube sk-cube6"></div> \
                  <div class="sk-cube sk-cube7"></div> \
                  <div class="sk-cube sk-cube8"></div> \
                  <div class="sk-cube sk-cube9"></div> \
              </div> \
          </div> \
          `,
        })
      },
      stopLoading = () => {
        if (myLoading.isLoading()) {
          myLoading.stop()
          win.loading_screen.finish()
          win.loading_screen = null
        }
      }

    renderLoad()

    win.$(() => {
      stopLoading()
    })

    setInterval(() => {
      if (win.loading && !win.loading_screen) {
        renderLoad()
      } else if (!win.loading && win.loading_screen) {
        stopLoading()
      }
    })
  }

  componentWillUnmount() {
    const win: any = window

    if (myLoading.isLoading()) {
      myLoading.stop()
      win.loading_screen.finish()
      win.loading_screen = null
    }
  }

  render() {
    return <></>
  }
}
