import "module-alias/register";
import "dotenv/config";

import prisma from "./database";

import BaseSeeder from "@base/BaseSeeder";

import { isDev } from "@utils/is";

import HeroSeeder from "@features/hero/HeroSeeder";

export default class Seeder {
  static devSeeder = [new HeroSeeder()];

  static prodSeeder = [];

  static async seed(seeders: Array<BaseSeeder>) {
    if (!seeders.length) {
      // eslint-disable-next-line no-console
      console.log("There's no seeder to run.");
    }

    try {
      for (const seeder of seeders) {
        await seeder.seed();
      }
    } catch (err: unknown) {
      throw err;
    } finally {
      await prisma.$disconnect();
    }
  }

  static async run() {
    if (isDev) {
      return await Seeder.seed(Seeder.devSeeder);
    }

    return await Seeder.seed(Seeder.prodSeeder);
  }
}

Seeder.run();
