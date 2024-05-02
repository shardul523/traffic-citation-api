import { prisma } from "../config/db";
import { catchAsync } from "../utils";

/**
 * @description     Get Current Officer Details
 * @route           /officers/me
 * @access          private->officer
 */
export const getCurrentOfficer = catchAsync(async (req, res) => {
  const officerId = +req.body.officerId;

  const officer = await prisma.officer.findUnique({ where: { id: officerId } });

  return res.status(200).json({
    status: "success",
    officer,
  });
});
