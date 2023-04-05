import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Test from "./pages/Test";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Test />
  </StrictMode>
);
