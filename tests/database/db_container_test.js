// How This Helps

// No environment drift: The DB is created fresh each time — never reusing an old Postgres volume.

// No credential confusion: You explicitly define which user and password the DB runs with.

// Reproducible across environments: Works the same locally and in GitHub Actions CI.

// Detects real-world issues: If the app can’t connect (wrong user, password, or role), the test fails immediately.
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe('🧪 Meals4V Database Environment', () => {
  let container;
  let prisma;

  beforeAll(async () => {
    // 1️⃣ Spin up an ephemeral Postgres container
    container = await new PostgreSqlContainer('postgres:16')
      .withDatabase('meals4v')
      .withUsername('app')
      .withPassword('app')
      .start();

    // 2️⃣ Set DATABASE_URL dynamically for Prisma
    process.env.DATABASE_URL = container.getConnectionUri();

    // 3️⃣ Initialize Prisma Client
    prisma = new PrismaClient();
    await prisma.$connect();
  });

  afterAll(async () => {
    // 4️⃣ Tear down container after tests
    await prisma.$disconnect();
    await container.stop();
  });

  test('✅ should connect to the database successfully', async () => {
    const dbName = await prisma.$queryRaw`SELECT current_database();`;
    expect(dbName[0].current_database).toBe('meals4v');
  });

  test('✅ should verify role exists and can create table', async () => {
    await prisma.$executeRawUnsafe(
      'CREATE TABLE test_table(id SERIAL PRIMARY KEY, name TEXT);'
    );
    const result = await prisma.$queryRaw`SELECT * FROM test_table;`;
    expect(result).toEqual([]);
  });
});
