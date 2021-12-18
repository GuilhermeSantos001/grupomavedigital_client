/**
 * @description Gerenciador de alertas
 * @author @GuilhermeSantos001
 * @update 22/10/2021
 */

interface IAlert {
  message: string;
  delay: number;
}

declare global {
  interface Window {
    Alerting: {
      show: boolean
      messageValue: string
      messageDelay: number
      cache: IAlert[]
      noCache: boolean
      delay: NodeJS.Timeout
    }
  }
}

class Alert {
  private timeout = 1500;

  /**
   * @description Verifica se o alerta está sendo exibido
   */
  isShowing(): boolean {
    return window.Alerting && window.Alerting.show;
  }

  setMessage(msg: string): void {
    if (window.Alerting)
      window.Alerting.messageValue = msg;
  }

  getMessage(): string {
    return window.Alerting && window.Alerting.messageValue;
  }

  setMessageDelay(delay: number): void {
    if (window.Alerting)
      window.Alerting.messageDelay = delay;
  }

  getMessageDelay(): number {
    return window.Alerting && window.Alerting.messageDelay;
  }

  /**
   * @description Cria um novo alerta
   */
  create(message: string, delay = 2500): void {
    if (!window.Alerting) {
      window.Alerting = {
        noCache: true,
        show: false,
        delay: undefined,
        cache: [],
        messageDelay: 0,
        messageValue: ''
      }
    };

    if (!window.Alerting.noCache) {
      window.Alerting.cache.push({ message, delay });
    } else {
      window.Alerting.noCache = false;
    }

    if (!this.isShowing()) {
      this.setMessage(message);
      this.setMessageDelay(delay);
      window.Alerting.show = true;
    }

    if (!window.Alerting.delay) {
      window.Alerting.delay = setTimeout(this.close.bind(this), delay + this.timeout);
    }
  }

  /**
   * @description Fecha o alerta
   */
  close(): void {
    if (window.Alerting.show) {
      clearTimeout(window.Alerting.delay);
      window.Alerting.delay = undefined;
      window.Alerting.show = false;

      window.Alerting.cache.shift();

      const data: IAlert = {
        message: window.Alerting.cache.at(0)?.message || "",
        delay: window.Alerting.cache.at(0)?.delay || 0
      };

      if (data.message.length > 0 && data.delay > 0) {
        window.Alerting.noCache = true;
        this.create(data.message, data.delay);
      }
    }
  }
}

export default new Alert();