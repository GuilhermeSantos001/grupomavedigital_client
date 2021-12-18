/// <reference types="cypress" />


// import function from the application source
import Loading from '@/src/utils/loading'

describe('Testando a utilidade para ativação/desativação do loading', () => {
    it('Testa a funcionalidade', () => {
        Loading.start();

        assert.equal(Loading.isLoading(), true, 'Loading está ativo')

        Loading.stop();

        assert.equal(Loading.isLoading(), false, 'Loading está inativo')
    })
})