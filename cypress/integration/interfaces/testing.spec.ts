/// <reference types="cypress" />


describe('Login dos usuários', () => {
    it('Testando o login de usuário', () => {
        cy.visit('/')

        cy.get('a[href*="/auth/login"]').click()

        cy.url().should('include', '/auth/login')

        cy.get('input[name=username]').type("ti-gui")
        cy.get('input[name=password]').type("123")

        cy.get('[data-testid=button-login]').click()

        cy.url().should('include', '/system')
    })
})

export { }