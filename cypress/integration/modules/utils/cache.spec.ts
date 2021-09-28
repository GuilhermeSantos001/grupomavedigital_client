/// <reference types="cypress" />

// import function from the application source
import Cache from '@/src/utils/cache'

describe('Testando a manipulação de cache', () => {
    it('Cria um novo cache', () => {
        cy.task('getConfiguration').then((config: any) => {
            const cache = new Cache("test_1", config.browserDatabase);

            cache.initialize();

            assert.equal(cache.isLoading(), true, 'cache criado e sendo carregado')
        });
    })

    it('Salva um novo valor', () => {
        cy.task('getConfiguration').then(async (config: any) => {
            const cache = new Cache("test_2", config.browserDatabase);

            await cache.initialize();

            assert.notStrictEqual(cache.set<"days">('username', 'GuilhermeSantos001', '2-days'), false, "Valor username salvo com sucesso")
            assert.notStrictEqual(cache.set<"days">('password', '123', '2-days'), false, "Valor password salvo com sucesso")

            assert.equal(cache.get('username')?.value, 'GuilhermeSantos001', 'Username correto');
            assert.equal(cache.get('password')?.value, '123', 'Password correta');
        });
    })

    it('Remove um valor existente', () => {
        cy.task('getConfiguration').then(async (config: any) => {
            const myCache = new Cache("test_3", config.browserDatabase);

            await myCache.initialize();

            assert.notStrictEqual(myCache.set<"days">('username', 'GuilhermeSantos001', '2-days'), false, "Valor username salvo com sucesso")
            assert.notStrictEqual(myCache.set<"days">('password', '123', '2-days'), false, "Valor password salvo com sucesso")

            assert.equal(await myCache.remove('username'), true, 'Username removido');
            assert.equal(await myCache.remove('password'), true, 'Password removido');
        });
    })
})