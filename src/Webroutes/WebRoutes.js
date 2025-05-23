import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegistrationForm from "../Components/Froms/RegistrationForm/RegistrationForm";
import LoginForm from "../Components/Froms/LoginForm/LoginForm";
import UserInputLayout from "../Layout/UserInputLayout/UserInputLayout";
import AdminLayout from "../Layout/AdminLayout/AdminLayout";
import ErrorPage from "../Components/ErrorPages/ErrorPage";
import AdminRoute from "../ProtectedRoute/AdminProtectedRoute/AdminRoute";
import UserRoute from "../ProtectedRoute/UserProtectedRoute/UserRoute";
import MemberAnalytics from "../Components/Tables/Members/MemberAnalytics/MemberAnalytics";
import LeadsAnalytics from "../Components/Tables/Leads/LeadsAnalytics/LeadsAnalytics";
import MemberList from "../Components/Tables/Members/MemberList/MemberList";
import CourseList from "../Components/Tables/Course/CourseList/CourseList";
import LeadsList from "../Components/Tables/Leads/LeadsList/LeadsList";
import SourceList from "../Components/Tables/Source/SourceList/SourceList";
import StatusList from "../Components/Tables/Status/StatusList/StatusList";
import StatusRegForm from "../Components/Froms/StatusRegForm/StatusRegForm";
import CourseRegForm from "../Components/Froms/CourseRegForm/CourseRegForm";
import SourceRegForm from "../Components/Froms/SourceRegForm/SourceRegForm";
import Test from "../Test/Lead";
import LeadImportForm from "../Components/Froms/LeadImportForm/LeadImportForm";
import UserInterface from "../Components/UserInterface/UserInterface";
import SourceAnalytics from "../Components/Tables/Source/SourceAnalytics/SourceAnalytics";
import Charts from "../Test/charts";
import SA from "../Test/SA";
import DashboardContent from "../Components/Dashboard/DashboardContent";

export default function WebRoutes() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<LoginForm />} />
          <Route
            exact
            path="/admin"
            element={
              <AdminRoute path="/admin">
                <AdminLayout />
              </AdminRoute>
            }>
            <Route
              exact
              path="/admin"
              element={
                <AdminRoute path="admin-dashboard">
                  <MemberAnalytics />
                </AdminRoute>
              }
            />
            <Route
              exact
              path="dashboard"
              element={
                <AdminRoute path="dashboard">
                  <DashboardContent />
                </AdminRoute>
              }
            />
            <Route
              exact
              path="members"
              element={
                <AdminRoute path="member">
                  <MemberList />
                </AdminRoute>
              }
            />
            <Route
              exact
              path="member-performance"
              element={
                <AdminRoute path="member-performance">
                  <MemberAnalytics />
                </AdminRoute>
              }
            />
            <Route
              exact
              path="reg-members"
              element={
                <AdminRoute path="member">
                  <RegistrationForm />
                </AdminRoute>
              }
            />
            {/* <Route
              exact
              path="lead-analytics"
              element={
                <AdminRoute path="member">
                  <Charts />
                </AdminRoute>
              }
            /> */}
            <Route
              exact
              path="reg-leads"
              element={
                <AdminRoute path="member">
                  <LeadImportForm />
                </AdminRoute>
              }
            />
            <Route
              exact
              path="source-analytics"
              element={
                <AdminRoute path="member">
                  <SourceAnalytics />
                </AdminRoute>
              }
            />
            <Route
              exact
              path="lead-analytics"
              element={
                <AdminRoute path="member">
                  <SA />
                </AdminRoute>
              }
            />
            <Route
              exact
              path="reg-status"
              element={
                <AdminRoute path="member">
                  <StatusRegForm />
                </AdminRoute>
              }
            />
            <Route
              exact
              path="reg-course"
              element={
                <AdminRoute path="member">
                  <CourseRegForm />
                </AdminRoute>
              }
            />
            <Route
              exact
              path="reg-source"
              element={
                <AdminRoute path="member">
                  <SourceRegForm />
                </AdminRoute>
              }
            />
            <Route
              exact
              path="leads"
              element={
                <AdminRoute path="member">
                  <LeadsList />
                </AdminRoute>
              }
            />
            <Route
              exact
              path="status"
              element={
                <AdminRoute path="member">
                  <StatusList />
                </AdminRoute>
              }
            />
            <Route
              exact
              path="course"
              element={
                <AdminRoute path="member">
                  <CourseList />
                </AdminRoute>
              }
            />
            <Route
              exact
              path="lead-analytics"
              element={
                <AdminRoute path="lead-analytics">
                  <Test />
                </AdminRoute>
              }
            />

            <Route
              exact
              path="source"
              element={
                <AdminRoute path="member">
                  <SourceList />
                </AdminRoute>
              }
            />
            <Route
              exact
              path="calling"
              element={
                <AdminRoute path="member">
                  <UserInterface />
                </AdminRoute>
              }
            />
            <Route path="*" element={<ErrorPage />} />
          </Route>

          <Route
            exact
            path="/user"
            element={
              <UserRoute>
                <UserInterface />
              </UserRoute>
            }>
            <Route
              exact
              path="/user"
              element={
                <UserRoute>
                  <UserInterface />
                </UserRoute>
              }
            />
            <Route path="*" element={<ErrorPage />} />
          </Route>
          <Route path="*" Component={<ErrorPage />} />
        </Routes>
        {/* <div>
          <Link className="ml-2 bg-black text-white" to={"/admin"}>
            <button>admin</button>
          </Link>
          <Link className="ml-2 bg-red-900 text-white" to={"/admin/dashboard"}>
            <button>dashboard</button>
          </Link>
          <Link className="ml-2 bg-blue-900 text-white" to={"/admin/member"}>
            <button>member</button>
          </Link>
        </div> */}
      </BrowserRouter>
    </>
  );
}
