import { Client, ID, Users } from "node-appwrite";
import prisma from "../config/db";

type Role = "User" | "Owner" | "Administrator" | "Veterinarian";

const adminClient = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT as string)
  .setProject(process.env.APPWRITE_PROJECT_ID as string)
  .setKey(process.env.APPWRITE_API_KEY as string);

const appwriteUsers = new Users(adminClient);

/* =============================
   Create User Service
   *TODO: This function creates a new user in the Appwrite identity provider and then creates a corresponding user and employee record in the database.
   =============================*/
export const createEmployeeService = async (
  requestId: string,
  userData: {
    email: string;
    password: string;
    name: string;
    farmId: number;
    role: "User" | "Owner" | "Administrator" | "Veterinarian";
  },
) => {
  const { email, password, name, farmId, role } = userData;

  const requesterProfile = await prisma.employee.findFirst({
    where: { farm_id: farmId, user_id: requestId },
  });

  if (
    !requesterProfile ||
    (requesterProfile.role !== "Owner" &&
      requesterProfile.role !== "Administrator")
  ) {
    throw {
      statusCode: 403,
      message:
        "Forbidden: Only Owners and Admins can create users for this farm.",
    };
  }

  let appwriteUserId: string;
  try {
    const finalPassword = password || ID.unique().slice(0, 10) + "A1!"; // Genera una contraseña temporal si no se proporciona

    const newAppwriteUser = await appwriteUsers.create(
      ID.unique(),
      email,
      undefined,
      finalPassword,
      name,
    );
    appwriteUserId = newAppwriteUser.$id;
  } catch (error: any) {
    if (error.code === 409) {
      throw {
        statusCode: 409,
        message: "Email already exists in the system.",
      };
    }
    throw {
      statusCode: 500,
      message: "Failed to create user in identity provider.",
    };
  }

  const result = await prisma.$transaction(async (tx) => {
    let dbUser = await tx.user.findUnique({ where: { id: appwriteUserId } });
    if (!dbUser) {
      dbUser = await tx.user.create({
        data: { id: appwriteUserId, email, name },
      });
    }

    const employment = await tx.employee.create({
      data: {
        user_id: dbUser.id,
        farm_id: farmId,
        name,
        role: role as Role,
      },
    });

    return { user: dbUser, employment };
  });

  return result;
};

/* =============================
   Update User Service
   *TODO: This function update the user information such as name, role, active status and email.
   =============================*/
export const updateEmployeeService = async (
  requesterId: string,
  targetUserId: string,
  updateData: {
    farmId: number;
    name?: string;
    email?: string;
    role?: "User" | "Owner" | "Administrator" | "Veterinarian";
    active?: boolean;
  },
) => {
  const { farmId, name, email, role, active } = updateData;
  const requesterProfile = await prisma.employee.findFirst({
    where: { farm_id: farmId, user_id: requesterId },
  });

  if (
    !requesterProfile ||
    (requesterProfile.role !== "Owner" &&
      requesterProfile.role !== "Administrator")
  ) {
    throw {
      statusCode: 403,
      message:
        "Forbidden: Only Owners and Admins can update users for this farm.",
    };
  }

  const targetProfile = await prisma.employee.findFirst({
    where: { farm_id: farmId, user_id: targetUserId },
  });

  if (!targetProfile) {
    throw {
      statusCode: 404,
      message: "User not found in this farm.",
    };
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedEmployment = await tx.employee.update({
      where: { id: targetProfile.id },
      data: {
        ...(role !== undefined && { role: role as any }),
        ...(active !== undefined && { active }),
      },
    });

    let updatedUser = null;
    if (name) {
      updatedUser = await tx.user.update({
        where: { id: targetUserId },
        data: { name },
      });
      await appwriteUsers.updateName(targetUserId, name);
    }

    if (email) {
      updatedUser = await tx.user.update({
        where: { id: targetUserId },
        data: { email },
      });
      await appwriteUsers.updateEmail(targetUserId, email);
    }

    return { employment: updatedEmployment, user: updatedUser };
  });

  return result;
};

/* =============================
   Delete User Service
   *TODO: This function delete the user from the farm only if they have no activity, otherwise it should be deactivated and not deleted.
   =============================*/
export const deleteEmployeeService = async (
  requesterId: string,
  targetUserId: string,
  farmId: number,
) => {
  const requesterProfile = await prisma.employee.findFirst({
    where: { farm_id: farmId, user_id: requesterId },
  });

  if (
    !requesterProfile ||
    (requesterProfile.role !== "Owner" &&
      requesterProfile.role !== "Administrator")
  ) {
    throw {
      statusCode: 403,
      message:
        "Forbidden: Only Owners and Admins can delete users for this farm.",
    };
  }

  const targetProfile = await prisma.employee.findFirst({
    where: { farm_id: farmId, user_id: targetUserId },
    include: {
      _count: {
        select: {
          sales: true,
          abortions: true,
          batch_feedings: true,
          batch_movements: true,
          farrowing_employees: true,
          farrowing_medications: true,
          litter_movements: true,
          matings: true,
          medical_treatments: true,
        },
      },
    },
  });

  if (!targetProfile) {
    throw {
      statusCode: 404,
      message: "User not found in this farm.",
    };
  }

  const hasActivity = Object.values(targetProfile._count).some(
    (count) => count > 0,
  );

  if (hasActivity) {
    throw {
      statusCode: 400,
      message:
        "Cannot delete user with existing farm activity. Use 'Deactivate' instead.",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.employee.delete({
      where: { id: targetProfile.id },
    });
    const otherEmployments = await tx.employee.count({
      where: { user_id: targetUserId },
    });

    if (otherEmployments === 0) {
      await tx.user.delete({
        where: { id: targetUserId },
      });
      await appwriteUsers.delete(targetUserId);
    }
  });

  return { message: "User deleted successfully from this farm." };
};
