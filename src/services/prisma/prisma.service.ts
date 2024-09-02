import { PrismaClient } from '@prisma/client';

class PrismaService extends PrismaClient {
  constructor() {
    super();
    this.$connect()
      .then(() => console.log('Connected to the database'))
      .catch((err: any) =>
        console.error('Failed to connect to the database', err)
      );
  }
}

const prisma = new PrismaService();
export default prisma;
