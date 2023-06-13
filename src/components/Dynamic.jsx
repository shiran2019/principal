import React, { useState } from "react";
import StdReg from "../pages/Registr";


const DynamicDiv = () => {
  const [divContent, setDivContent] = useState("Initial Content");

  const updateDivContent = (content) => {
    setDivContent(content);
  };

  return (
    <div>
      <p>{divContent}</p>
      <button onClick={() => updateDivContent(<StdReg/>)}>Button 1</button>
      <button onClick={() => updateDivContent("Content 2")}>Button 2</button>
      <button onClick={() => updateDivContent("Content 3")}>Button 3</button>
    </div>
  );
};

export default DynamicDiv;
