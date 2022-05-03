import { eitId, mitId, itId, nursingId } from "./ids.js";

const institutions = [
  {
    _id: eitId,
    name: "Eastern Institute of Technology",
    region: "Hawkes Bay",
    country: "New Zealand",
    departments: [itId],
  },
  {
    _id: mitId,
    name: "Manukau Institute of Technology",
    region: "Auckland",
    country: "New Zealand",
    departments: [itId, nursingId],
  },
  {
    name: "Nelson Marlborough Institute of Technology",
    region: "Tasman",
    country: "New Zealand",
  },
  {
    name: "Northland Polytechnic",
    region: "Northland",
    country: "New Zealand",
  },
  {
    name: "Otago Polytechnic",
    region: "Otago",
    country: "New Zealand",
  },
  {
    name: "Southern Institute of Technology",
    region: "Southland",
    country: "New Zealand",
  },
  {
    name: "Tai Poutini Polytechnic",
    region: "West Coast",
    country: "New Zealand",
  },
  {
    name: "University of Auckland",
    region: "Auckland",
    country: "New Zealand",
  },
  {
    name: "University of Canterbury",
    region: "Canterbury",
    country: "New Zealand",
  },
  {
    name: "University of Otago",
    region: "Otago",
    country: "New Zealand",
  },
];

export { institutions };
