import { Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <h1>ChurchKiosk Admin</h1>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}


export default App;