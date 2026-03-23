import prisma from "../config/db";

export const createFarmService = async (name: string, owner?: string) => {
  return await prisma.farm.create({
    data: {
      name,
      owner,
    },
  });
};

export const getAllFarmsService = async () => {
  return await prisma.farm.findMany();
};
