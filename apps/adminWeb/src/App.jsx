import { Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>ChurchKiosk Admin</h1>} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}


export default App;