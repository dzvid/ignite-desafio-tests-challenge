import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate a user", async () => {
    const user = {
      name: "John Mark",
      email: "john@mark.com",
      password: "123456789",
    };

    await createUserUseCase.execute(user);

    const authUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(authUser).toHaveProperty("user");
    expect(authUser).toHaveProperty("token");
  });

  it("should not be able to authenticate a user with wrong email", async () => {
    const user = {
      name: "John Mark",
      email: "john@mark.com",
      password: "123456789",
    };

    await createUserUseCase.execute(user);

    expect(async () => {
      const authUser = await authenticateUserUseCase.execute({
        email: "notjohnemail@badmail.com",
        password: user.password,
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate a user with wrong password", async () => {
    const user = {
      name: "John Mark",
      email: "john@mark.com",
      password: "123456789",
    };

    await createUserUseCase.execute(user);

    expect(async () => {
      const authUser = await authenticateUserUseCase.execute({
        email: user.email,
        password: "YouShallNotPass!",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate a user with both wrong email and password", async () => {
    const user = {
      name: "John Mark",
      email: "john@mark.com",
      password: "123456789",
    };

    await createUserUseCase.execute(user);

    expect(async () => {
      const authUser = await authenticateUserUseCase.execute({
        email: "MyBuddyEricEmail@badmail.com",
        password: "ShallNotPass!",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
