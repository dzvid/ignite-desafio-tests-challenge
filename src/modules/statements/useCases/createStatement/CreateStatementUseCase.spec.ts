import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Deposit Statement Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementRepository
    );
  });

  it("should be able to create a deposit statement", async () => {
    const user = {
      name: "John Mark",
      email: "john@mark.com",
      password: "123456789",
    };

    const newUser = await createUserUseCase.execute(user);
    const user_id = newUser.id as string;

    const statement = new Statement();

    Object.assign(statement, {
      user_id,
      type: "deposit",
      amount: 50,
      description: "Cinquentinha to her",
    });

    const depositStatement = await createStatementUseCase.execute(statement);

    expect(depositStatement).toHaveProperty("id");
    expect(depositStatement.user_id).toBe(statement.user_id);
    expect(depositStatement.type).toBe(statement.type);
    expect(depositStatement.amount).toBe(statement.amount);
    expect(depositStatement.description).toBe(statement.description);
  });

  it("should not be able to create a deposit statement if user does not exists", async () => {
    expect(async () => {
      const user_id = "fake-id-f341210923-does-not-exists";
      const statement = new Statement();
      Object.assign(statement, {
        user_id,
        type: "deposit",
        amount: 50,
        description: "Cinquentinha to her",
      });

      const depositStatement = await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
