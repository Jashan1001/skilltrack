import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />

      <main className="w-full max-w-[1600px] mx-auto px-6 pt-6 pb-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;