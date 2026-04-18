import { Routes, Route } from "react-router-dom";
import Composition from "./index";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Composition />} />
      <Route index element={<Composition />} />
      <Route path="/ask" element={<div />} />
    </Routes>
  );
}
