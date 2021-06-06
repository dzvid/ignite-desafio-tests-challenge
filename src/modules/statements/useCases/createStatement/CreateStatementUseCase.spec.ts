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

describe("Create Statement Use Case", () => {
  describe("Create Deposit Statement", () => {
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

        const depositStatement = await createStatementUseCase.execute(
          statement
        );
      }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });
  });

  describe("Create Withdraw Statement", () => {
    beforeEach(() => {
      inMemoryUsersRepository = new InMemoryUsersRepository();
      inMemoryStatementRepository = new InMemoryStatementsRepository();
      createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
      createStatementUseCase = new CreateStatementUseCase(
        inMemoryUsersRepository,
        inMemoryStatementRepository
      );
    });

    it("should be able to create a withdraw statement", async () => {
      const user = {
        name: "John Mark",
        email: "john@mark.com",
        password: "123456789",
      };

      const newUser = await createUserUseCase.execute(user);
      const user_id = newUser.id as string;
      const depositOperation = new Statement();
      Object.assign(depositOperation, {
        user_id,
        type: "deposit",
        amount: 50,
        description: "Cinquentinha to her",
      });
      const depositStatement = await createStatementUseCase.execute(
        depositOperation
      );

      const withdrawOperation = new Statement();
      Object.assign(withdrawOperation, {
        user_id,
        type: "withdraw",
        amount: 40,
        description: "Alexa, por favor saca 40 conto pra comprar itaipava",
      });
      const withdrawStatement = await createStatementUseCase.execute(
        withdrawOperation
      );

      expect(withdrawStatement).toHaveProperty("id");
      expect(withdrawStatement.user_id).toBe(withdrawOperation.user_id);
      expect(withdrawStatement.type).toBe(withdrawOperation.type);
      expect(withdrawStatement.amount).toBe(withdrawOperation.amount);
      expect(withdrawStatement.description).toBe(withdrawOperation.description);
    });

    it("should not be able to create a withdraw statement if user does not exists", async () => {
      expect(async () => {
        const user_id = "fake-user-does-not-exists-120318291328";

        const withdrawOperation = new Statement();
        Object.assign(withdrawOperation, {
          user_id,
          type: "withdraw",
          amount: 100,
          description: "Alexa, por favor saca 40 conto pra comprar itaipava",
        });
        const withdrawStatement = await createStatementUseCase.execute(
          withdrawOperation
        );
      }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });

    it("should not be able to create a withdraw statement when user has insufficient funds", async () => {
      expect(async () => {
        const user = {
          name: "John Mark",
          email: "john@mark.com",
          password: "123456789",
        };

        const newUser = await createUserUseCase.execute(user);
        const user_id = newUser.id as string;
        const depositOperation = new Statement();
        Object.assign(depositOperation, {
          user_id,
          type: "deposit",
          amount: 50,
          description: "Cinquentinha to her",
        });
        const depositStatement = await createStatementUseCase.execute(
          depositOperation
        );

        const withdrawOperation = new Statement();
        Object.assign(withdrawOperation, {
          user_id,
          type: "withdraw",
          amount: 100,
          description: "Alexa, por favor saca 40 conto pra comprar itaipava",
        });
        const withdrawStatement = await createStatementUseCase.execute(
          withdrawOperation
        );
      }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });
  });
});
