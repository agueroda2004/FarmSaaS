import prisma from "../config/db";
import { validateFarmMembership } from "../utils/farmAuth";

/* =============================
   Create Race Service
   DOES: This functions creates a new race in the farm.
   =============================*/
export const createRaceService = async (
  requesterId: string,
  data: {
    farmId: number;
    name: string;
  },
) => {
  const { farmId, name } = data;

  await validateFarmMembership(requesterId, farmId, ["Owner", "Administrator"]);

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
   Update Race Service
   DOES: This functions updates the race information such as name and active status.
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

  await validateFarmMembership(requesterId, farmId, ["Owner", "Administrator"]);

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
   DOES: This functions deletes a race from the farm.
   =============================*/
export const deleteRaceService = async (
  requesterId: string,
  farmId: number,
  raceId: number,
) => {
  await validateFarmMembership(requesterId, farmId, ["Owner", "Administrator"]);

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
   Get Races Service
   DOES: This functions gets all the races of a farm.
   =============================*/
export const getRacesService = async (requesterId: string, farmId: number) => {
  await validateFarmMembership(requesterId, farmId);

  const races = await prisma.race.findMany({
    where: { farm_id: farmId },
    orderBy: { name: "asc" },
  });

  return races;
};

/* =============================
   Delete Race Service
   DOES: This functions gets a single race from the farm.
   =============================*/
export const getSingleRaceService = async (
  requesterId: string,
  raceId: number,
  farmId: number,
) => {
  await validateFarmMembership(requesterId, farmId);

  const race = await prisma.race.findFirst({
    where: { id: raceId, farm_id: farmId },
  });

  if (!race) {
    throw { statusCode: 404, message: "Race not found in this farm." };
  }

  return race;
};
