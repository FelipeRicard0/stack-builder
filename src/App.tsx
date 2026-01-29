import { Route, Routes } from "react-router-dom";
import Buildpage from "./pages/Builder";
import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/builder" element={<Buildpage />} />
    </Routes>
  );
}
