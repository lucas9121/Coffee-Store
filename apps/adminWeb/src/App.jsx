import { Route, Routes } from "react-router";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>ChurchKiosk Admin</h1>} />
      <Route path="/login" element={<h1>Admin Login</h1>} />
    </Routes>
  );
}

export default App;