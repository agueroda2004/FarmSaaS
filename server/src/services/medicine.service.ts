import prisma from "../config/db";
import { validateFarmMembership } from "../utils/farmAuth";

export const createMedicineService = async (
  requesterId: string,
  data: { farmId: number; name: string },
) => {
  const { name, farmId } = data;
  await validateFarmMembership(requesterId, farmId, ["Administrator", "Owner"]);

  const existingMedicine = await prisma.medicine.findFirst({
    where: {
      name,
      farm_id: farmId,
    },
  });

  if (existingMedicine) {
    throw {
      statusCode: 409,
      message: "A medicine with this name already exists in the farm",
    };
  }

  const medicine = await prisma.medicine.create({
    data: {
      farm_id: farmId,
      name,
    },
  });

  return medicine;
};

export const getMedicinesService = async (
  requesterId: string,
  farmId: number,
  active?: string,
) => {
  await validateFarmMembership(requesterId, farmId);

  const medicines = await prisma.medicine.findMany({
    where: {
      farm_id: farmId,
      ...(active !== undefined && { active: active === "true" }),
    },
    orderBy: {
      name: "asc",
    },
  });

  return medicines;
};

export const getSingleMedicineService = async (
  requesterId: string,
  farmId: number,
  medicineId: number,
) => {
  await validateFarmMembership(requesterId, farmId);

  const medicine = await prisma.medicine.findFirst({
    where: { farm_id: farmId, id: medicineId },
  });

  if (!medicine) {
    throw {
      statusCode: 404,
      message: "Medicine not found in this farm",
    };
  }

  return medicine;
};

export const updateMedicineService = async (
  requesterId: string,
  medicineId: number,
  data: {
    farmId: number;
    name?: string;
    active?: boolean;
  },
) => {
  const { farmId, active, name } = data;

  await validateFarmMembership(requesterId, farmId, ["Administrator", "Owner"]);

  const medicine = await prisma.medicine.findFirst({
    where: { farm_id: farmId, id: medicineId },
  });

  if (!medicine) {
    throw {
      statusCode: 404,
      message: "Medicine not found in this farm",
    };
  }

  if (name && name !== undefined) {
    const existingMedicine = await prisma.medicine.findFirst({
      where: { farm_id: farmId, name },
    });

    if (existingMedicine) {
      throw {
        statusCode: 409,
        message: "A medicine with this name already exists in this farm.",
      };
    }
  }

  const updateMedicine = await prisma.medicine.update({
    where: { id: medicineId },
    data: {
      ...(name !== undefined && { name }),
      ...(active !== undefined && { active }),
    },
  });

  return updateMedicine;
};

export const deleteMedicineService = async (
  requesterId: string,
  medicineId: number,
  farmId: number,
) => {
  await validateFarmMembership(requesterId, farmId, ["Administrator", "Owner"]);

  const medicine = await prisma.medicine.findFirst({
    where: { farm_id: farmId, id: medicineId },
    include: {
      _count: {
        select: {
          farrowing_medications: true,
          medical_treatments: true,
        },
      },
    },
  });

  if (!medicine) {
    throw {
      statusCode: 404,
      message: "Medicine not found in this farm",
    };
  }

  const hasActivity = Object.values(medicine._count).some((count) => count > 0);

  if (hasActivity) {
    throw {
      statusCode: 400,
      message:
        "Cannot delete medicine with existing activity. Desactivate it instead.",
    };
  }

  await prisma.medicine.delete({
    where: { id: medicineId },
  });
};
