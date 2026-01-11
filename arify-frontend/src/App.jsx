import { Routes, Route } from "react-router-dom";
import Book from "./booking/Book";

export default function App() {
  return (
    <Routes>
      <Route path="/book" element={<Book />} />
    </Routes>
  );
}
