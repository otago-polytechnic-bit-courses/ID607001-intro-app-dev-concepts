import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import InstitutionTable from "./tables/InstitutionTable";

const Navigation = () => {
  return (
    <Router>
      <Routes>
        <Route path="/institutions" element={<InstitutionTable />} />
      </Routes>
    </Router>
  );
};

export default Navigation;
