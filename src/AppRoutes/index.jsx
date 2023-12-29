import { Route, Routes } from "react-router-dom";
// pages imports

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute redirectPath="/login">
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* routes that are protected 
        </Route> */}
        <Route
          path="/"
          element={
            <h1>Project working fine! You may start your development</h1>
          }
        />
        {/* routes that are public */}
      </Routes>
    </>
  );
};

export default AppRoutes;
