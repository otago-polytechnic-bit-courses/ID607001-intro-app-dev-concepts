import { seedInstitutions } from "./institution.js";
import { seedDepartments } from "./department.js";
import { seedCourses } from "./course.js";
import { seedUsers } from "./user.js";

const seedAll = async () => {
  console.log("==========================================");
  console.log("Seeding Report");
  console.log("==========================================");

  const startTime = Date.now();
  const results = [];

  // Seed institutions
  const institutionsResult = await seedInstitutions();
  results.push(institutionsResult);

  // Seed departments
  const departmentsResult = await seedDepartments();
  results.push(departmentsResult);

  // Seed courses
  const coursesResult = await seedCourses();
  results.push(coursesResult);

  // Seed users
  const usersResult = await seedUsers();
  results.push(usersResult);

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);

  // Display results
  results.forEach((result) => {
    console.log(`Resource: ${result.resource}`);
    console.log(`  Records created: ${result.count}`);
    console.log(`  Time taken: ${result.time}s`);
    if (result.errors.length > 0) {
      console.log(`  Errors: ${result.errors.join(", ")}`);
    }
    console.log("------------------------------------------");
  });

  console.log(`Total time: ${totalTime}s`);

  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  console.log(
    `Errors encountered: ${totalErrors === 0 ? "None" : totalErrors}`
  );
  console.log("==========================================");

  process.exit(0);
};

seedAll();
