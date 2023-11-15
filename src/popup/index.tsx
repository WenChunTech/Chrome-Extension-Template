import React from "react";
import { createRoot } from "react-dom/client";
import Popup from "./Popup";
import "uno.css";

const container = document.getElementById("app");

createRoot(container).render(<Popup />);
