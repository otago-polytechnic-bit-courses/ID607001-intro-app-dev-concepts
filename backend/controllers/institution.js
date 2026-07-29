// Hard-coded data - replaced with real database queries in Module 04
const INSTITUTIONS = [
  {
    id: "1",
    name: "Otago Polytechnic",
    region: "Otago",
    country: "New Zealand",
  },
  {
    id: "2",
    name: "Southern Institute of Technology",
    region: "Southland",
    country: "New Zealand",
  },
  {
    id: "3",
    name: "Ara Institute of Canterbury",
    region: "Canterbury",
    country: "New Zealand",
  },
];

const getInstitutions = (req, res) => {
  return res.status(200).json({ data: INSTITUTIONS });
};

const getInstitution = (req, res) => {
  const { id } = req.params;
  const institution = INSTITUTIONS.find((i) => i.id === id);

  if (!institution) {
    return res.status(404).json({
      message: `No institution with id: ${id} found`,
    });
  }

  return res.status(200).json({ data: institution });
};

export { getInstitutions, getInstitution };
