import institutionRepository from "../repositories/institution.js";

const createInstitution = async ({ name, region, country }) => {
  await institutionRepository.create({ name, region, country });
  return institutionRepository.findAll();
};

const getInstitutions = async () => {
  const institutions = await institutionRepository.findAll();
  if (!institutions) {
    throw new Error("No institutions found");
  }
  return institutions;
};

const getInstitution = async (id) => {
  const institution = await institutionRepository.findById(id);
  if (!institution) {
    throw new Error(`No institution with the id: ${id} found`);
  }
  return institution;
};

const updateInstitution = async (id, { name, region, country }) => {
  const existing = await institutionRepository.findById(id);
  if (!existing) {
    throw new Error(`No institution with the id: ${id} found`);
  }
  return institutionRepository.update(id, { name, region, country });
};

const deleteInstitution = async (id) => {
  const institution = await institutionRepository.findById(id);
  if (!institution) {
    throw new Error(`No institution with the id: ${id} found`);
  }
  await institutionRepository.delete(id);
};

export default {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
};
