import prisma from "../config/db";

type LocationType =
  | "Gestation"
  | "Farrowing"
  | "Nursery"
  | "Fattening"
  | "Quarantine"
  | "Hospital";

/* =============================
   Create Location Service
   DOES: This functions creates a new location in the farm.
   =============================*/
export const createLocationService = async (
  requesterId: string,
  data: {
    farmId: number;
    name: string;
    type: LocationType;
    capacity?: number;
    observation?: string;
  },
) => {
  const { farmId, name, type, capacity, observation } = data;

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

  const existingLocation = await prisma.location.findFirst({
    where: { farm_id: farmId, name },
  });

  if (existingLocation) {
    throw {
      statusCode: 409,
      message: "A location with this name already exists in this farm.",
    };
  }

  const location = await prisma.location.create({
    data: {
      farm_id: farmId,
      name,
      type,
      ...(capacity !== undefined && { capacity }),
      ...(observation !== undefined && { observation }),
    },
  });

  return location;
};

/* =============================
   Get Locations Service
   DOES: This function retrieves all locations in the farm. It can also filter by location type.
   =============================*/
export const getLocationsService = async (
  requesterId: string,
  farmId: number,
  type?: LocationType,
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

  const locations = await prisma.location.findMany({
    where: { farm_id: farmId, ...(type !== undefined && { type }) },
    orderBy: { name: "asc" },
  });

  return locations;
};

/* =============================
   Get Single Location Service
   DOES: This functions gets a single location of a farm.
   =============================*/
export const getSingleLocationService = async (
  requesterId: string,
  locationId: number,
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

  const location = await prisma.location.findFirst({
    where: { id: locationId, farm_id: farmId },
  });

  if (!location) {
    throw { statusCode: 404, message: "Location not found in this farm." };
  }

  return location;
};

/* =============================
   Update Location Service
   DOES: This function updates an existing location in the farm.
   =============================*/
export const updateLocationService = async (
  requesterId: string,
  locationId: number,
  data: {
    farmId: number;
    name?: string;
    type?: LocationType;
    capacity?: number;
    observation?: string;
    active?: boolean;
  },
) => {
  const { farmId, name, type, capacity, observation, active } = data;

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
        "Forbidden: Only Owners and Admins can update locations on this farm.",
    };
  }

  const location = await prisma.location.findFirst({
    where: { farm_id: farmId, id: locationId },
  });

  if (!location) {
    throw { statusCode: 404, message: "Location not found in this farm." };
  }

  if (name && name !== location.name) {
    const existingLocation = await prisma.location.findFirst({
      where: { farm_id: farmId, name },
    });

    if (existingLocation) {
      throw {
        statusCode: 409,
        message: "A location with this name already exists in this farm.",
      };
    }
  }

  const updateLocation = await prisma.location.update({
    where: { id: locationId },
    data: {
      ...(name !== undefined && { name }),
      ...(type !== undefined && { type }),
      ...(capacity !== undefined && { capacity }),
      ...(observation !== undefined && { observation }),
      ...(active !== undefined && { active }),
    },
  });

  return updateLocation;
};

/* =============================
   Delete Location Service
   DOES: This functions deletes a location from the farm. It checks if the location has activities assigned, if it does, it will not allow the deletion.
   =============================*/
export const deleteLocationService = async (
  requesterId: string,
  locationId: number,
  farmId: number,
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
      message:
        "Forbidden: Only Owners and Admins can create locations on this farm.",
    };
  }

  const location = await prisma.location.findFirst({
    where: { farm_id: farmId, id: locationId },
    include: {
      _count: {
        select: {
          animals: true,
          services: true,
          farrowings: true,
          batch_locations: true,
          medical_treatments: true,
        },
      },
    },
  });

  if (!location) {
    throw { statusCode: 404, message: "Location not found in this farm." };
  }

  const hasActiviy = Object.values(location._count).some((count) => count > 0);

  if (hasActiviy) {
    throw {
      statusCode: 400,
      message:
        "Cannot delete a location that has activities assigned. Deactivate it instead.",
    };
  }

  await prisma.location.delete({
    where: { id: locationId },
  });
};
