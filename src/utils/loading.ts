/**
 * @description Gerenciador de loading
 * @author @GuilhermeSantos001
 * @update 22/09/2021
 * @version 1.0.0
 */

class Loading {
  static updateWindow(value: boolean) {
    const win: any = window;

    win.loading = value;
  }

  static windowLoading() {
    const win: any = window;

    return win.loading;
  }

  /**
   * @description Verifica se o loading está ativado
   */
  isLoading(): boolean {
    return Loading.windowLoading();
  }

  /**
   * @description Inicia a execução do loading
   */
  start(): void {
    if (!this.isLoading()) {
      Loading.updateWindow(true);
    }
  }

  /**
   * @description Para a execução do loading
   */
  stop(): void {
    if (this.isLoading()) {
      Loading.updateWindow(false);
    }
  }
}

const loading = new Loading();

export default loading;