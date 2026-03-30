import prisma from "../config/db";

type Role = "User" | "Owner" | "Administrator" | "Veterinarian";

/* =============================
   Validate Farm Membership
   DOES: This function checks if the requester is a member of the specified farm and optionally checks if they have one of the required roles to perform certain actions.
   =============================*/
export const validateFarmMembership = async (
  requesterId: string,
  farmId: number,
  requiredRoles?: Role[],
) => {
  const profile = await prisma.employee.findFirst({
    where: {
      user_id: requesterId,
      farm_id: farmId,
    },
  });

  if (!profile || !profile.active) {
    throw {
      statusCode: 403,
      message: "Forbidden: You are not a member of this farm.",
    };
  }

  if (requiredRoles && !requiredRoles.includes(profile.role)) {
    throw {
      statusCode: 403,
      message: `Forbidden: Only ${requiredRoles.join(" and ")} can perform this action.`,
    };
  }

  return profile;
};
