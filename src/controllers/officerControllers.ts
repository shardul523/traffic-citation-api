import { prisma } from "../config/db";
import { catchAsync } from "../utils";

/**
 * @description     Get Current Officer Details
 * @route           /officers/me
 * @access          private->officer
 */
export const getCurrentOfficer = catchAsync(async (req, res) => {
  const {
    auth: { officerId },
  } = req.body;

  const officer = await prisma.officer.findUnique({
    where: { officerId },
    select: { name: true, email: true, officerId: true },
  });

  return res.status(200).json({
    status: "success",
    officer,
  });
});
