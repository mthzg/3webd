import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";

export default function App() {
  return (
    <>
      <Navbar />
      <SearchBar />
      <Outlet />
    </>
  );
}
