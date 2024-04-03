import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prismaSingleton = () => {
  const client = new PrismaClient({
    log: [
      {
        level: "query",
        emit: "event",
      },
    ],
  });

  // https://www.prisma.io/docs/orm/prisma-client/client-extensions#limitations
  client.$on("query", ({ query, params, duration, timestamp }) => {
    console.log(
      `\x1b[33m[QUERY]\x1b[0m: ${query}, \x1b[33m[PARAMS]\x1b[0m: ${params}, \x1b[35m[DURATION]\x1b[0m: ${duration}ms, \x1b[35m[TIMESTAMP]\x1b[0m: ${timestamp}`
    );
  });

  const extendedClient = client.$extends(withAccelerate());

  return extendedClient;
};

type PrismaClientExtended = ReturnType<typeof prismaSingleton>;

type OmitPrismaClient = Omit<
  PrismaClientExtended,
  | symbol
  | "$connect"
  | "$disconnect"
  | "$executeRaw"
  | "$executeRawUnsafe"
  | "$extends"
  | "$on"
  | "$queryRaw"
  | "$queryRawUnsafe"
  | "$transaction"
  | "$use"
>;

// Define the models object type
type Models = {
  -readonly [ModelName in keyof OmitPrismaClient]: OmitPrismaClient[ModelName];
};

let models = {} as Models;

const prisma = prismaSingleton();

// Dynamically generate model objects
Object.keys(prisma).forEach((modelName) => {
  const key = modelName as keyof OmitPrismaClient;

  if (isNotAModel(key)) return;

  models = Object.assign(models, { [key]: prisma[key] });
});

// type-guard
function isNotAModel(key: string): key is keyof OmitPrismaClient {
  if (key.startsWith("$")) return true;

  return false;
}

export { models };

export default prisma;
