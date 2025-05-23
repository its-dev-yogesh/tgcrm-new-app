import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TGCRMContext } from "../../Context/Context";

function AdminRoute({ children }) {
  const { AuthUser, userToken } = useContext(TGCRMContext);
  const [auth, setauth] = useState(false);
  const Navigate = useNavigate();
  // const auth = true;
  useEffect(() => {
    const define_auth = () => {
      return userToken && AuthUser.role === "admin"
        ? setauth(true)
        : (setauth(false), Navigate("/"));
    };
    define_auth(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userToken]);

  return auth && children;
}

export default AdminRoute;
