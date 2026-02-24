import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageContainer from "./PageContainer";
const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100">
      <Navbar />
      <PageContainer>
      <main className="max-w-5xl mx-auto px-6 py-10">
        <Outlet />
        
      </main>
      </PageContainer>
    </div>
  );
};

export default AppLayout;