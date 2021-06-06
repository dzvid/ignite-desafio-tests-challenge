import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to show user information based on user id", async () => {
    const user = {
      name: "John Mark",
      email: "john@mark.com",
      password: "123456789",
    };

    const newUser = await createUserUseCase.execute(user);
    const user_id = newUser.id as string;
    const userInfo = await showUserProfileUseCase.execute(user_id);

    expect(userInfo).toHaveProperty("id");
    expect(userInfo).toHaveProperty("name");
    expect(userInfo.name).toBe(user.name);
    expect(userInfo).toHaveProperty("email");
    expect(userInfo.email).toBe(user.email);
    expect(userInfo).toHaveProperty("password");
  });

  it("should not be able to show user information based on a wrong user id", async () => {
    const user = {
      name: "John Mark",
      email: "john@mark.com",
      password: "123456789",
    };

    const newUser = await createUserUseCase.execute(user);
    const user_id = "fakeid-1826213-asassd";

    expect(async () => {
      const userInfo = await showUserProfileUseCase.execute(user_id);
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
