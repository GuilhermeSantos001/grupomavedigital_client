/**
 * @description Gerenciador de alertas
 * @author @GuilhermeSantos001
 * @update 14/09/2021
 * @version 1.0.0
 */

interface IAlert {
  message: string;
  delay: number;
}

class Alert {
  private show = false;
  private delay: any = false;
  private timeout = 1500;
  private cache: IAlert[] = [];
  private noCache = false;
  private messageValue: string;
  private messageDelay: number;

  constructor() {
    this.messageValue = "";
    this.messageDelay = 0;
  }

  /**
   * @description Verifica se o alerta está sendo exibido
   */
  isShowing(): boolean {
    return this.show;
  }

  setMessage(msg: string): void {
    this.messageValue = msg;
  }

  getMessage(): string {
    return this.messageValue;
  }

  setMessageDelay(delay: number): void {
    this.messageDelay = delay;
  }

  getMessageDelay(): number {
    return this.messageDelay;
  }

  /**
   * @description Cria um novo alerta
   */
  create(message: string, delay = 2500): void {
    if (!this.noCache) {
      this.cache.push({ message, delay });
    } else {
      this.noCache = false;
    }

    if (!this.isShowing()) {
      this.show = true;
      this.setMessage(message);
      this.setMessageDelay(delay);
    }

    if (!this.delay) {
      this.delay = setTimeout(() => {
        clearTimeout(this.delay),
          this.delay = false,
          this.show = false;

        this.cache.shift();

        const data: IAlert = {
          message: this.cache.at(0)?.message || "",
          delay: this.cache.at(0)?.delay || 0
        };

        if (data.message.length > 0 && data.delay > 0) {
          this.noCache = true;
          this.create(data.message, data.delay);
        }
      }, delay + this.timeout);
    }
  }
}

const alerting = new Alert();

export default alerting;