/// <reference types="cypress" />


// import function from the application source
import App from '@/src/app'

describe('Testando as propriedades do aplicativo', () => {
    it('Testa as propriedades', () => {
        assert.isOk(typeof App.version === 'string', 'propriedade version está com o tipo correto');
        assert.equal(App.version, '1.0.0', 'propriedade version está com o valor correto');

        assert.isOk(typeof App.license === 'string', 'propriedade license está com o tipo correto');
        assert.equal(App.license, 'MIT', 'propriedade license está com o valor correto');

        assert.isOk(typeof App.author === 'string', 'propriedade author está com o tipo correto');
        assert.equal(App.author, 'GuilhermeSantos001 <luizgp120@hotmail.com>', 'propriedade author está com o valor correto');

        assert.isOk(typeof App.fullname === 'string', 'propriedade fullname está com o tipo correto');
        assert.equal(App.fullname, 'Rocket.js', 'propriedade fullname está com o valor correto');
    })

    it('Testa os métodos', () => {
        assert.isNotFunction(App.block_close_page, 'método block_close_page não é uma função')
        assert.isNotFunction(App.external_mail_open, 'método block_close_page não é uma função')
    })
})