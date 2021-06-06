import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;

let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Show User Profile Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to show user balance with statement", async () => {
    const user = {
      name: "John Mark",
      email: "john@mark.com",
      password: "123456789",
    };

    const newUser = await createUserUseCase.execute(user);
    const user_id = newUser.id as string;

    const balanceWithStatement = await getBalanceUseCase.execute({ user_id });

    expect(balanceWithStatement).toHaveProperty("balance");
    expect(balanceWithStatement).toHaveProperty("statement");
    expect(balanceWithStatement.statement).toHaveLength(0);
  });

  it("should not be able to show balance for a user that does not exists", async () => {
    expect(async () => {
      const user_id = "fake-id-12831k-fake";

      const balanceWithStatement = await getBalanceUseCase.execute({ user_id });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
