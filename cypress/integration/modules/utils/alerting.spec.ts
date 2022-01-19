/// <reference types="cypress" />


// import function from the application source
import Alerting from '@/src/utils/alerting'

describe('Testando a utilidade para criação de alertas', () => {
    it('Cria um novo alerta', () => {
        const
            message = 'Testando o alerta',
            delay = 2500; // Delay padrão

        Alerting.create('question', message);

        assert.strictEqual(Alerting.isShowing(), true, 'alerta está sendo exibido');
        assert.equal(Alerting.getMessage(), message, 'alerta está com a mensagem correta');
        assert.equal(Alerting.getMessageDelay(), delay, 'alerta está com o delay padrão correto');
    })
})