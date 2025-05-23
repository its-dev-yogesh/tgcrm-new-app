// import LoginForm from "./Components/Froms/LoginForm/LoginForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WebRoutes from "./Webroutes/WebRoutes";
// import Navbar from "./Components/Navbar/Navbar";
// import Sidebar from "./Components/Sidebar/Sidebar";
// import { useContext } from "react";
// import MainLayout from "./Layout/MainLayout";
// import { TGCRMContext } from "./Context/Context";

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <div className="App">
        <WebRoutes />
      </div>
    </QueryClientProvider>
  );
}

export default App;
