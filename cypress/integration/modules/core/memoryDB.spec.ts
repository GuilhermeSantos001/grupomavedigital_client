/// <reference types="cypress" />

// import function from the application source
import MemoryDB from '@/src/core/memoryDB'

interface IUser {
  id: string
  username: string
  password: string
}

describe('Testando o banco de dados em memoria', () => {
  it('Armazena e recupera um novo dado', async () => {
    const
      memory = new MemoryDB("test", 1),
      user: IUser = {
        id: "001",
        username: "GuilhermeSantos001",
        password: "123"
      };

    await memory.storeAdd<IUser>("main", "id", user)

    const
      users = await memory.storeGet<IUser>("main", "id", "001"),
      getUser = users instanceof Array ? users[0] : users;

    assert.equal(getUser.id, "001", 'ID do usuario está correto');
    assert.equal(getUser.username, "GuilhermeSantos001", 'Nome do usuario está correto');
    assert.equal(getUser.password, "123", 'Senha do usuario está correta');
  })

  it('Armazena e atualiza um novo dado', async () => {
    const
      memory = new MemoryDB("test", 1),
      user: IUser = {
        id: "001",
        username: "GuilhermeSantos001",
        password: "123"
      },
      updateUser: IUser = {
        id: "001",
        username: "GuilhermeSantos001",
        password: "123456"
      };


    await memory.storeAdd<IUser>("main", "id", user);
    await memory.storeUpdate<IUser>("main", "id", "001", updateUser);

    const
      users = await memory.storeGet<IUser>("main", "id", "001"),
      getUser = users instanceof Array ? users[0] : users;

    assert.equal(getUser.id, "001", 'ID do usuario está correto');
    assert.equal(getUser.username, "GuilhermeSantos001", 'Nome do usuario está correto');
    assert.equal(getUser.password, "123456", 'Senha do usuario está correta');
  })

  it('Armazena e retorna todos os novos valores', async () => {
    const
      memory = new MemoryDB("test", 1),
      users: IUser[] = [
        {
          id: "001",
          username: "Douglas",
          password: "123"
        },
        {
          id: "002",
          username: "Diego",
          password: "568"
        },
        {
          id: "003",
          username: "Natalia",
          password: "689"
        }
      ];

    for (const user of users) {
      await memory.storeAdd<IUser>("main", "id", user);
    }

    const getUser = await memory.storeGetAll<IUser>("main", "id")

    assert.deepEqual(getUser, [
      {
        id: "001",
        username: "Douglas",
        password: "123"
      },
      {
        id: "002",
        username: "Diego",
        password: "568"
      },
      {
        id: "003",
        username: "Natalia",
        password: "689"
      }
    ], 'Usuarios retornados com sucesso');
  })

  it('Armazena e remove e retorna os novos valores', async () => {
    const
      memory = new MemoryDB("test", 1),
      users: IUser[] = [
        {
          id: "001",
          username: "Douglas",
          password: "123"
        },
        {
          id: "002",
          username: "Diego",
          password: "568"
        },
        {
          id: "003",
          username: "Natalia",
          password: "689"
        }
      ];

    for (const user of users) {
      await memory.storeAdd<IUser>("main", "id", user);
    }

    await memory.storeRemove<IUser>("main", "id", "002")

    const getUser = await memory.storeGetAll<IUser>("main", "id")

    assert.deepEqual(getUser, [
      {
        id: "001",
        username: "Douglas",
        password: "123"
      },
      {
        id: "003",
        username: "Natalia",
        password: "689"
      }
    ], 'Usuarios retornados com sucesso');
  })
})