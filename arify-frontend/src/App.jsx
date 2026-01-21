import { Routes, Route, Navigate } from "react-router-dom";
import Book from "./booking/Book";

export default function App() {
  return (
    <Routes>
      {/* NORMAL */}
      <Route path="/" element={<Navigate to="/book" replace />} />
      <Route path="/book" element={<Book />} />

      {/* 🔥 RENDER STATIC FIX */}
      <Route path="/index.html" element={<Book />} />
    </Routes>
  );
}
