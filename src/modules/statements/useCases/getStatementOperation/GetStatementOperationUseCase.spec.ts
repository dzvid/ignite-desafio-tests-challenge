import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementRepository
    );
  });

  it("should be able to find and get a deposit statement", async () => {
    // setup user
    const user = {
      name: "John Mark",
      email: "john@mark.com",
      password: "123456789",
    };
    const newUser = await createUserUseCase.execute(user);
    const user_id = newUser.id as string;

    // setup deposit
    const depositOperation = new Statement();
    Object.assign(depositOperation, {
      user_id,
      type: "deposit",
      amount: 50,
      description: "Cinquentinha primo",
    });
    const depositStatement = await createStatementUseCase.execute(
      depositOperation
    );

    const statement_id = depositStatement.id as string;

    // get statement operation
    const foundDepositStatement = await getStatementOperationUseCase.execute({
      user_id,
      statement_id,
    });

    expect(foundDepositStatement).toMatchObject(depositStatement);
  });

  it("should be able to find and get a withdraw statement", async () => {
    // setup user
    const user = {
      name: "John Mark",
      email: "john@mark.com",
      password: "123456789",
    };
    const newUser = await createUserUseCase.execute(user);
    const user_id = newUser.id as string;

    // setup withdraw
    const withdrawOperation = new Statement();
    Object.assign(withdrawOperation, {
      user_id,
      type: "deposit",
      amount: 100,
      description: "R$ 100 do jogo!",
    });
    const withdrawStatement = await createStatementUseCase.execute(
      withdrawOperation
    );

    const statement_id = withdrawStatement.id as string;

    // get statement operation
    const foundWithdrawStatement = await getStatementOperationUseCase.execute({
      user_id,
      statement_id,
    });

    expect(foundWithdrawStatement).toMatchObject(withdrawStatement);
  });

  it("should not be able to find and get information of a statement that does not exists", async () => {
    await expect(async () => {
      // setup user
      const user = {
        name: "John Mark",
        email: "john@mark.com",
        password: "123456789",
      };
      const newUser = await createUserUseCase.execute(user);
      const user_id = newUser.id as string;

      const statement_id = "fake-statement-id-192812387";

      // get statement operation
      const tryFindWithdrawStatement =
        await getStatementOperationUseCase.execute({
          user_id,
          statement_id,
        });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it("should not be able to find and get information of a statement from a user that does not exists", async () => {
    await expect(async () => {
      const user_id = "this-user-id-does-not-exits-1237166217";
      const statement_id = "fake-statement-id-192812387";

      await getStatementOperationUseCase.execute({
        user_id,
        statement_id,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
});
