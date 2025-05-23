import { Route, Routes } from "react-router-dom";
import LoginForm from "../../Components/Froms/LoginForm/LoginForm";
import RegistrationForm from "../../Components/Froms/RegistrationForm/RegistrationForm";
import ErrorPage from "../../Components/ErrorPages/ErrorPage";

const AdminProtectedComponent = () => {
  return (
    <Routes>
      {/* Nested routes */}
      <Route exact path="/admin-dashboard" element={<LoginForm />} />
      <Route exact path="/dashboard" element={<RegistrationForm />} />
      <Route exact path="/member" element={<LoginForm />} />
      <Route path="*" Component={<ErrorPage />} />
    </Routes>
  );
};
export default AdminProtectedComponent;
