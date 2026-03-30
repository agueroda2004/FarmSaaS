import prisma from "../config/db";
import { validateFarmMembership } from "../utils/farmAuth";

type AnimalType = "Sow" | "Boar";

/* =============================
   Create Animal Service
   DOES: This functions creates a new animal in the farm. 
   =============================*/
export const createAnimalService = async (
  requesterId: string,
  data: {
    farmId: number;
    raceId: number;
    tagNumber: string;
    type: AnimalType;
    entryDate: string;
    bornDate?: string;
    parity?: number;
    locationId?: number;
    observation?: string;
  },
) => {
  const {
    farmId,
    raceId,
    tagNumber,
    type,
    entryDate,
    bornDate,
    parity,
    locationId,
    observation,
  } = data;

  await validateFarmMembership(requesterId, farmId, ["Owner", "Administrator"]);

  const existingTag = await prisma.animal.findFirst({
    where: { farm_id: farmId, tag_number: tagNumber },
  });

  if (existingTag) {
    throw {
      statusCode: 409,
      message: "An animal with this tag number already exists in this farm",
    };
  }

  const race = await prisma.race.findFirst({
    where: { id: raceId, farm_id: farmId },
  });

  if (!race) {
    throw { statusCode: 404, message: "Race not found in this farm" };
  }

  if (locationId) {
    const location = await prisma.location.findFirst({
      where: { id: locationId, farm_id: farmId },
    });

    if (!location) {
      throw { statusCode: 404, message: "Location not found in this farm" };
    }
  }

  const animal = await prisma.animal.create({
    data: {
      farm_id: farmId,
      race_id: raceId,
      tag_number: tagNumber,
      type,
      entry_date: new Date(entryDate),
      ...(bornDate !== undefined && { born_date: new Date(bornDate) }),
      ...(parity !== undefined && { parity }),
      ...(locationId !== undefined && { location_id: locationId }),
      ...(observation !== undefined && { observation }),
    },
    include: {
      race: { select: { id: true, name: true } },
      location: { select: { id: true, name: true } },
    },
  });

  return animal;
};

/* =============================
   Update Animal Service
   DOES: This functions updates an existing animal in the farm.
   =============================*/
export const updateAnimalService = async (
  requesterId: string,
  animalId: number,
  data: {
    farmId: number;
    raceId?: number;
    tagNumber?: string;
    entryDate?: string;
    bornDate?: string;
    parity?: number;
    locationId?: number | null;
    observation?: string | null;
    active?: boolean;
  },
) => {
  const {
    farmId,
    raceId,
    tagNumber,
    entryDate,
    bornDate,
    parity,
    locationId,
    observation,
    active,
  } = data;

  await validateFarmMembership(requesterId, farmId, ["Owner", "Administrator"]);

  const animal = await prisma.animal.findFirst({
    where: { farm_id: farmId, id: animalId },
  });

  if (!animal) {
    throw { statusCode: 404, message: "Animal not found in this farm" };
  }

  if (tagNumber && tagNumber !== animal.tag_number) {
    const existingTag = await prisma.animal.findFirst({
      where: { farm_id: farmId, tag_number: tagNumber },
    });

    if (existingTag) {
      throw {
        statusCode: 409,
        message: "An animal with this tag number already exists in this farm",
      };
    }
  }

  if (bornDate) {
    const effectiveEntryDate = entryDate
      ? new Date(entryDate)
      : animal.entry_date;

    if (new Date(bornDate) > effectiveEntryDate) {
      throw {
        statusCode: 400,
        message: `Born date cannot be greater than entry date (${effectiveEntryDate.toISOString().split("T")[0]}).`,
      };
    }
  }

  const isOnlyUpdatingActiveStatus =
    active !== undefined &&
    !tagNumber &&
    !raceId &&
    !entryDate &&
    !bornDate &&
    !parity &&
    !locationId &&
    !observation;

  if (!animal.active && !isOnlyUpdatingActiveStatus) {
    throw {
      statusCode: 400,
      message: "Cannot update an inactive animal. Reactivate it first.",
    };
  }

  if (entryDate) {
    const dates: Date[] = [];

    if (animal.type === "Sow") {
      const firstService = await prisma.service.findFirst({
        where: { sow_id: animalId },
        orderBy: { start_date: "asc" },
      });
      if (firstService) dates.push(firstService.start_date);
    }

    if (animal.type === "Boar") {
      const firstMating = await prisma.mating.findFirst({
        where: { boar_id: animalId },
        orderBy: { date: "asc" },
      });
      if (firstMating) dates.push(firstMating.date);
    }

    const firstRemoval = await prisma.animalRemoval.findFirst({
      where: { animal_id: animalId },
      orderBy: { date: "asc" },
    });
    if (firstRemoval) dates.push(firstRemoval.date);

    if (dates.length > 0) {
      const earliestDate = new Date(Math.min(...dates.map((d) => d.getTime())));

      if (new Date(entryDate) > earliestDate) {
        throw {
          statusCode: 400,
          message: `Entry date cannot be greater than the first recorded event (${earliestDate.toISOString().split("T")[0]}).`,
        };
      }
    }
  }

  if (raceId) {
    const race = await prisma.race.findFirst({
      where: { farm_id: farmId, id: raceId },
    });

    if (!race) {
      throw { statusCode: 404, message: "Race not found in this arm" };
    }
  }

  if (locationId) {
    const location = await prisma.location.findFirst({
      where: { farm_id: farmId, id: locationId },
    });

    if (!location) {
      throw { statusCode: 404, message: "Location not found in this farm" };
    }
  }

  const updateAnimal = await prisma.animal.update({
    where: { id: animalId },
    data: {
      ...(tagNumber !== undefined && { tag_number: tagNumber }),
      ...(raceId !== undefined && { race_id: raceId }),
      ...(entryDate !== undefined && { entry_date: new Date(entryDate) }),
      ...(bornDate !== undefined && { born_date: new Date(bornDate) }),
      ...(parity !== undefined && { parity }),
      ...(locationId !== undefined && { location_id: locationId }),
      ...(observation !== undefined && { observation }),
      ...(active !== undefined && { active }),
    },
    include: {
      race: { select: { id: true, name: true } },
      location: { select: { id: true, name: true, type: true } },
    },
  });

  return updateAnimal;
};

/* =============================
   Delete Animal Service
   DOES: This functions deletes an existing animal from the farm. It checks if the animal has activities assigned, if it does, it will not allow the deletion.
   =============================*/
export const deleteAnimalService = async (
  requesterId: string,
  animalId: number,
  farmId: number,
) => {
  await validateFarmMembership(requesterId, farmId, ["Owner", "Administrator"]);

  const animal = await prisma.animal.findFirst({
    where: { farm_id: farmId, id: animalId },
    include: {
      _count: {
        select: {
          matings: true,
          medical_treatments: true,
          removals: true,
          sales: true,
          services: true,
        },
      },
    },
  });

  if (!animal) {
    throw { statusCode: 404, message: "Animal not found in this farm" };
  }

  const hasActivity = Object.values(animal._count).some((cound) => cound > 0);

  if (hasActivity) {
    throw {
      statusCode: 400,
      message:
        "Cannot delete an animal with existing activity. Desactivate it instead",
    };
  }

  await prisma.animal.delete({
    where: { farm_id: farmId, id: animalId },
  });
};

/* =============================
   Get Animals Service
   DOES: This functions retrieves a list of animals from the farm. It can filter by type, raceId, locationId and active status.
   =============================*/
export const getAnimalsService = async (
  requesterId: string,
  farmId: number,
  filters: {
    type?: AnimalType;
    raceId?: number;
    locationId?: number;
    active?: string;
  },
) => {
  const { type, raceId, locationId, active } = filters;

  await validateFarmMembership(requesterId, farmId);

  const animals = await prisma.animal.findMany({
    where: {
      farm_id: farmId,
      ...(type !== undefined && { type }),
      ...(raceId !== undefined && { race_id: raceId }),
      ...(locationId !== undefined && { location_id: locationId }),
      ...(active !== undefined && { active: active === "true" }),
    },
    include: {
      race: { select: { id: true, name: true } },
      location: { select: { id: true, name: true, type: true } },
    },
    orderBy: { tag_number: "asc" },
  });

  return animals;
};

/* =============================
   Get Single Animal Service
   DOES: This functions retrieves a single animal from the farm.
   =============================*/
export const getSingleAnimalService = async (
  requesterId: string,
  animalId: number,
  farmId: number,
) => {
  await validateFarmMembership(requesterId, farmId);

  const animal = await prisma.animal.findFirst({
    where: { id: animalId, farm_id: farmId },
    include: {
      race: { select: { id: true, name: true } },
      location: { select: { id: true, name: true, type: true } },
    },
  });

  if (!animal) {
    throw { statusCode: 404, message: "Animal not found in this farm" };
  }

  return animal;
};
