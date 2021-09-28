/// <reference types="cypress" />

// import function from the application source
import Variables from '@/src/db/variables'

interface IUser {
  id: string
  username: string
  password: string
}

describe('Testando o banco de dados em memoria', () => {
  it('Armazena e recupera uma nova variavel', async () => {
    const
      variables = new Variables(1, "Memory"),
      user: IUser = {
        id: "001",
        username: "GuilhermeSantos001",
        password: "123"
      };

    await variables.define('username', user.username);
    await variables.define('password', user.password);

    assert.equal(await variables.get<string>('username'), user.username, 'Nome do usuario está correto');
    assert.equal(await variables.get<string>('password'), user.password, 'Senha do usuario está correta');
  })

  it('Armazena e remove e retorna as variaveis', async () => {
    const
      variables = new Variables(2, "Memory"),
      users: IUser[] = [
        {
          id: "001",
          username: "Lucas 3G",
          password: "2258"
        }
      ];

    await variables.define(`username-${users[0].id}`, users[0].username);
    await variables.define(`password-${users[0].id}`, users[0].password);

    assert.equal(await variables.get<string>(`username-${users[0].id}`), users[0].username);
    assert.equal(await variables.get<string>(`password-${users[0].id}`), users[0].password);
  })
})