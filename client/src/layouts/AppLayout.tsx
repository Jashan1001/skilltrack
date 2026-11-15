import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AppLayout: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  return (
    <div className="h-dvh flex overflow-hidden bg-background text-foreground transition-colors">
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenu={() => setMobileNavOpen((open) => !open)} />

        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-7 xl:px-9">
          <div className="mx-auto min-h-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
