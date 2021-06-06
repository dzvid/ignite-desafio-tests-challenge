import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User Use Case", ()=>{
  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it('should be able to create a new user', async ()=>{
    const user = {
      name: "John Mark",
      email:"john@mark.com",
      password: '123456'
    }

    const newUser = await createUserUseCase.execute(user);

    expect(newUser).toHaveProperty('id')
    expect(newUser).toHaveProperty('name')
    expect(newUser).toHaveProperty('email')
    expect(newUser).toHaveProperty('password')
  })

  it('should not be able to create a new user if it already exists', async ()=>{
    const user = {
      name: "John Mark",
      email:"john@mark.com",
      password: '123456'
    }

    expect(async ()=>{
      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
