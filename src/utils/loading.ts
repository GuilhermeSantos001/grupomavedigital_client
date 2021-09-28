/**
 * @description Gerenciador de loading
 * @author @GuilhermeSantos001
 * @update 22/09/2021
 * @version 1.0.0
 */

class Loading {
  private loading: boolean;

  constructor() {
    this.loading = false;
  }

  /**
   * @description Verifica se o loading está ativado
   */
  isLoading(): boolean {
    return this.loading;
  }

  /**
   * @description Inicia a execução do loading
   */
  start(): void {
    if (!this.isLoading()) {
      this.loading = true;
    }
  }

  /**
   * @description Para a execução do loading
   */
  stop(): void {
    if (this.isLoading()) {
      this.loading = false;
    }
  }
}

const loading = new Loading();

export default loading;