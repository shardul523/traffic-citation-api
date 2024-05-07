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
      async signup(uid: string, email: string, name: string, password: string) {
        const encPassword = await bcrypt.hash(password, 12);
        const user: Prisma.UserCreateInput = {
          uid,
          name,
          email,
          password: encPassword,
        };
        const createdUser = await prisma.user.create({ data: user });
        return createdUser;
      },

      async signin(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return;

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return;

        return user;
      },
    },
    officer: {
      async signup(
        officerId: string,
        email: string,
        name: string,
        password: string
      ) {
        const encPassword = await bcrypt.hash(password, 12);
        const officer: Prisma.OfficerCreateInput = {
          officerId,
          name,
          email,
          password: encPassword,
        };
        const createdOfficer = await prisma.officer.create({ data: officer });

        return createdOfficer;
      },

      async signin(officerId: string, password: string) {
        const officer = await prisma.officer.findUnique({
          where: { officerId },
        });

        if (!officer) return;

        const isPasswordValid = await bcrypt.compare(
          password,
          officer.password
        );

        if (!isPasswordValid) return;

        return officer;
      },
    },
    admin: {
      async signup(email: string, password: string) {
        const encPassword = await bcrypt.hash(password, 12);
        const user: Prisma.AdminCreateInput = {
          email,
          password: encPassword,
        };
        const createdUser = await prisma.admin.create({ data: user });
        return createdUser;
      },

      async signin(email: string, password: string) {
        const user = await prisma.admin.findUnique({ where: { email } });

        if (!user) return;

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return;

        return user;
      },
    },
  },
});
