import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { containsAllRoles } from "../utils/helpers";
import Spinner from "../utils/Spinner";


const ProtectedRoute = ({ redirectPath = "/", children, roles }) => {
  const {
    isAuthenticated,
    isLoading,
    data: user,
  } = useSelector((store) => store.auth);

  let location = useLocation();
  // if auth loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-white">
        <Spinner />
      </div>
    );
  }
  // if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }
  // if user is authenticated but not contains provided roles
  if (roles && !containsAllRoles(roles, user?.roles)) {
    return (
      <Navigate to={"/access-denied"} replace state={{ from: location }} />
    );
  }
  return children ? children : <Outlet />;
};

export default ProtectedRoute;