import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div>
      <h1>Error 404: Page not found</h1>
      <p>The requested page does not exist.</p>
      <Link to="/admin/dashboard">Go Home</Link>
    </div>
  );
};

export default ErrorPage;
