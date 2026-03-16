import prisma from "../prisma/db.js";

const defaultSelect = {
  id: true,
  firstName: true,
  lastName: true,
  emailAddress: true,
  permissionLevel: true,
  lecturer: {
    select: {
      id: true,
      department: true,
      phoneNumber: true,
      officeNumber: true,
    },
  },
  student: {
    select: {
      id: true,
      studentNumber: true,
    },
  },
};

class UserRepository {
  async createLecturer(data) {
    return await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.emailAddress,
        password: data.password,
        permissionLevel: "STAFF",
        lecturer: {
          create: {
            departmentId: data.departmentId,
            phoneNumber: data.phoneNumber,
            officeNumber: data.officeNumber,
          },
        },
      },
      select: defaultSelect,
    });
  }

  async createStudent(data) {
    return await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.emailAddress,
        password: data.password,
        permissionLevel: "STUDENT",
        student: {
          create: {
            studentNumber: data.studentNumber,
          },
        },
      },
      select: defaultSelect,
    });
  }

  async findByEmail(emailAddress) {
    return await prisma.user.findUnique({
      where: { emailAddress },
      include: {
        lecturer: {
          include: { department: true },
        },
        student: true,
      },
    });
  }
}

export default new UserRepository();
