import { catchAsync } from "../utils";
import { prisma } from "../config/db";

/**
 * @description Get Current User Profile
 * @route       GET /users/me
 * @access      private
 */
export const getCurrentUser = catchAsync(async (req, res, next) => {
  const { userId } = req.body;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) return next(new Error("Invalid Jwt"));

  return res.status(200).json({ status: "success", user });
});

/**
 * @description Update Current User Details
 * @route       PATCH /users/me
 * @access      private
 */
export const updateCurrentUser = catchAsync(async (req, res, next) => {
  const { userId, email, password, name } = req.body;

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      email,
      name,
      password,
    },
  });

  return res.status(201).json({
    status: "success",
    message: "User updated successfully",
    user: updatedUser,
  });
});
