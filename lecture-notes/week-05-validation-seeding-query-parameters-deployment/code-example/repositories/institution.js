import prisma from "../prisma/db.js";

class InstitutionRepository {
  async create(data) {
    return await prisma.institution.create({ data });
  }

  async findAll(
    filters = {},
    sortBy = "id",
    sortOrder = "asc",
    page = "1",
    pageSize = "10",
  ) {
    // Ensure page and pageSize are positive integers
    const parsedPage = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const parsedPageSize =
      parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;

    // Build dynamic WHERE clause from filters
    const where = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value === "string") {
          Object.assign(where, { [key]: { contains: value } });
        } else if (typeof value === "boolean" || typeof value === "number") {
          Object.assign(where, { [key]: { equals: value } });
        }
      }
    }

    const totalCount = await prisma.institution.count({ where: filters });
    const totalPages = Math.ceil(totalCount / parsedPageSize);

    const institutions = await prisma.institution.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (parsedPage - 1) * parsedPageSize,
      take: parsedPageSize,
    });

    return {
      data: institutions,
      pagination: {
        currentPage: parsedPage,
        pageSize: parsedPageSize,
        totalCount,
        totalPages,
        nextPage: parsedPage < totalPages ? parsedPage + 1 : null,
        prevPage: parsedPage > 1 ? parsedPage - 1 : null,
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
