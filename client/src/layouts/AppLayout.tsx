import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AppLayout: React.FC = () => {
  return (
    <div className="h-screen flex 
                bg-gray-50 dark:bg-neutral-950 
                text-gray-900 dark:text-neutral-100 
                transition-colors">
      
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default AppLayout;