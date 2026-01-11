import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Book from "./booking/Book";

function StripIndexHtml() {
  const location = useLocation();

  if (location.pathname === "/index.html") {
    return <Navigate to="/book" replace />;
  }

  return null;
}

export default function App() {
  return (
    <>
      <StripIndexHtml />
      <Routes>
        <Route path="/" element={<Navigate to="/book" replace />} />
        <Route path="/book" element={<Book />} />
      </Routes>
    </>
  );
}

