import prisma from "../config/db";

/* =============================
   Create Race Service
   *DOES: This functions creates a new race in the farm. It checks if the requester is an active member of the farm and has the role of Owner or Administrator.
   =============================*/
export const createRaceService = async (
  requesterId: string,
  data: {
    farmId: number;
    name: string;
  },
) => {
  const { farmId, name } = data;

  const requesterProfile = await prisma.employee.findFirst({
    where: { farm_id: farmId, user_id: requesterId },
  });

  if (
    !requesterProfile ||
    !requesterProfile.active ||
    (requesterProfile.role !== "Owner" &&
      requesterProfile.role !== "Administrator")
  ) {
    throw {
      statusCode: 403,
      message:
        "Forbidden: Only Owners and Admins can create races on this farm.",
    };
  }

  const existingRace = await prisma.race.findFirst({
    where: { name, farm_id: farmId },
  });

  if (existingRace) {
    throw {
      statusCode: 409,
      message: "A race with this name already exists in this farm.",
    };
  }

  const race = await prisma.race.create({
    data: {
      name,
      farm_id: farmId,
    },
  });

  return race;
};

/* =============================
   Get Races Service
   *DOES: This functions gets all the races of a farm. It check if the requester is an active member of the farm.
   =============================*/
export const getRacesService = async (requesterId: string, farmId: number) => {
  const requesterProfile = await prisma.employee.findFirst({
    where: { farm_id: farmId, user_id: requesterId },
  });

  if (!requesterProfile || !requesterProfile.active) {
    throw {
      statusCode: 403,
      message: "Forbidden: You are not a member of this farm.",
    };
  }

  const races = await prisma.race.findMany({
    where: { farm_id: farmId },
    orderBy: { name: "asc" },
  });

  return races;
};

/* =============================
   Update Race Service
   *DOES: This functions updates the race information such as name and active status. It checks if the requester is an active member of the farm and has the role of Owner or Administrator.
   =============================*/
export const updateRaceService = async (
  requesterId: string,
  raceId: number,
  data: {
    farmId: number;
    name?: string;
    active?: boolean;
  },
) => {
  const { farmId, name, active } = data;

  const requerterProfile = await prisma.employee.findFirst({
    where: { farm_id: farmId, user_id: requesterId },
  });

  if (
    !requerterProfile ||
    !requerterProfile.active ||
    (requerterProfile.role !== "Owner" &&
      requerterProfile.role !== "Administrator")
  ) {
    throw {
      statusCode: 403,
      message: "Forbidden: Only Owners and Admins can update races.",
    };
  }

  const race = await prisma.race.findFirst({
    where: { id: raceId, farm_id: farmId },
  });

  if (!race) {
    throw { statusCode: 404, message: "Race not found in this farm." };
  }

  if (name && name !== race.name) {
    const existingRace = await prisma.race.findFirst({
      where: { name, farm_id: farmId },
    });

    if (existingRace) {
      throw {
        statusCode: 409,
        message: "A race with this name already exists in this farm.",
      };
    }
  }

  const updatedRace = await prisma.race.update({
    where: { id: raceId },
    data: {
      ...(name !== undefined && { name }),
      ...(active !== undefined && { active }),
    },
  });

  return updatedRace;
};

/* =============================
   Delete Race Service
   *DOES: This functions deletes a race from the farm. It checks if the race has animals assigned, if it does, it will not allow the deletion.
   =============================*/
export const deleteRaceService = async (
  requesterId: string,
  farmId: number,
  raceId: number,
) => {
  const requesterProfile = await prisma.employee.findFirst({
    where: { farm_id: farmId, user_id: requesterId },
  });

  if (
    !requesterProfile ||
    !requesterProfile.active ||
    (requesterProfile.role !== "Owner" &&
      requesterProfile.role !== "Administrator")
  ) {
    throw {
      statusCode: 403,
      message: "Forbidden: Only Owners and Admins can delete races.",
    };
  }

  const race = await prisma.race.findFirst({
    where: { id: raceId, farm_id: farmId },
    include: { _count: { select: { animals: true } } },
  });

  if (!race) {
    throw { statusCode: 404, message: "Race not found in this farm." };
  }

  if (race._count.animals > 0) {
    throw {
      statusCode: 400,
      message:
        "Cannot delete a race that has animals assigned. Deactivate it instead.",
    };
  }

  await prisma.race.delete({
    where: { id: raceId },
  });
};

/* =============================
   Delete Race Service
   *DOES: This functions gets a single race from the farm. It checks if the requester is an active member of the farm.
   =============================*/
export const getSingleRaceService = async (
  requesterId: string,
  raceId: number,
  farmId: number,
) => {
  const requesterProfile = await prisma.employee.findFirst({
    where: { farm_id: farmId, user_id: requesterId },
  });

  if (!requesterProfile || !requesterProfile.active) {
    throw {
      statusCode: 403,
      message: "Forbidden: You are not a member of this farm.",
    };
  }

  const race = await prisma.race.findFirst({
    where: { id: raceId, farm_id: farmId },
  });

  if (!race) {
    throw { statusCode: 404, message: "Race not found in this farm." };
  }

  return race;
};
