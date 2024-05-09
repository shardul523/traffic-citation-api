import { catchAsync } from "../utils";
import { prisma } from "../config/db";

/**
 * @description Get Current User Profile
 * @route       GET /users/me
 * @access      private
 */
export const getCurrentUser = catchAsync(async (req, res, next) => {
  const { id } = req.body.auth;

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) return next(new Error("Invalid Jwt"));

  return res.status(200).json({ status: "success", user });
});

/**
 * @description Update Current User Details
 * @route       PATCH /users/me
 * @access      private
 */
export const updateCurrentUser = catchAsync(async (req, res, next) => {
  const { email, password, name } = req.body;
  const { id } = req.body.auth;

  const updatedUser = await prisma.user.update({
    where: {
      id,
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

/**
 * @description   Delete User By Id
 * @route         DELETE /users/:userId
 * @access        admin
 */
export const deleteUserById = catchAsync(async (req, res) => {
  const { userId }: { userId?: string } = req.params;

  await prisma.user.delete({ where: { id: +userId } });

  return res.status(204).json({
    status: "success",
    message: "User Deleted Successfully",
  });
});
