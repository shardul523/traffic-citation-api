import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
// import { connect } from 'mongoose'

// export async function connectDB() {
//     const MONGO_URI = process.env.DATABASE_URI.replace('<password>', process.env.DATABASE_PASSWORD)
//     await connect(MONGO_URI)
//     console.log('Database connected')
// }

export const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async signup(uid: string, name: string, password: string) {
        const encPassword = await bcrypt.hash(password, 12);
        const user: Prisma.UserCreateInput = {
          uid,
          name,
          password: encPassword,
        };
        const createdUser = await prisma.user.create({ data: user });
        return createdUser;
      },
    },
  },
});
