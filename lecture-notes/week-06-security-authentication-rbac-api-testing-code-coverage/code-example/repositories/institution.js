import prisma from "../prisma/db.js";

class InstitutionRepository {
  async create(data) {
    return await prisma.institution.create({ data });
  }

  async findAll(
    filters = {},
    sortBy = "id",
    sortOrder = "asc",
    page = 1,
    pageSize = 10
  ) {
    page = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    pageSize = parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;

    const totalCount = await prisma.institution.count({
      where: filters,
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    const query = {
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    };

    if (Object.keys(filters).length > 0) {
      query.where = {};

      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== "") {
          if (typeof value === "string") {
            query.where[key] = { contains: value };
          } else if (typeof value === "boolean") {
            query.where[key] = { equals: value };
          } else if (typeof value === "number") {
            query.where[key] = { equals: value };
          }
        }
      }
    }

    const institutions = await prisma.institution.findMany(query);

    return {
      data: institutions,
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    };
  }

  async findById(id) {
    return await prisma.institution.findUnique({
      where: { id },
    });
  }

  async update(id, data) {
    return await prisma.institution.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await prisma.institution.delete({
      where: { id },
    });
  }
}

export default new InstitutionRepository();
