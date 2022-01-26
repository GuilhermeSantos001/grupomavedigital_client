/**
 * @description Gerenciador de alertas
 * @author GuilhermeSantos001
 * @update 26/01/2022
 */

type AlertType = 'question' | 'success' | 'warning' | 'error' | 'info'

interface IAlert {
  type: AlertType
  message: string;
  delay: number;
}

declare global {
  interface Window {
    Alerting: {
      show: boolean
      messageValue: string
      messageDelay: number
      typeValue: AlertType
      cache: IAlert[]
      type: AlertType
      noCache: boolean
      delay: NodeJS.Timeout | undefined
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

  setTypeValue(type: AlertType): void {
    if (window.Alerting)
      window.Alerting.typeValue = type;
  }

  getType(): AlertType {
    return window.Alerting ? window.Alerting.type : "question";
  }

  /**
   * @description Cria um novo alerta
   */
  create(type: AlertType, message: string, delay = 3600): void {
    if (!window.Alerting) {
      window.Alerting = {
        noCache: true,
        show: false,
        delay: undefined,
        type: type,
        cache: [],
        messageDelay: 0,
        messageValue: '',
        typeValue: 'question'
      }
    };

    if (!window.Alerting.noCache) {
      window.Alerting.cache.push({ type, message, delay });
    } else {
      window.Alerting.noCache = false;
    }

    if (!this.isShowing()) {
      this.setMessage(message);
      this.setMessageDelay(delay);
      this.setTypeValue(type);

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
      if (window.Alerting.delay)
        clearTimeout(window.Alerting.delay);

      window.Alerting.delay = undefined;
      window.Alerting.show = false;

      window.Alerting.cache.shift();

      const data: IAlert = {
        type: window.Alerting.cache.at(0)?.type || "question",
        message: window.Alerting.cache.at(0)?.message || "",
        delay: window.Alerting.cache.at(0)?.delay || 0
      };

      if (data.message.length > 0 && data.delay > 0) {
        window.Alerting.noCache = true;
        this.create(data.type, data.message, data.delay);
      }
    }
  }
}

export default new Alert();