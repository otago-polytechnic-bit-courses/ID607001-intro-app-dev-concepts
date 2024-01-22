import { useState } from "react";

import MyFirstComponent from "./MyFirstComponent";

const App = () => {
  const [name, setName] = useState("Jeff");

  return <MyFirstComponent name={name} />;
};

export default App;