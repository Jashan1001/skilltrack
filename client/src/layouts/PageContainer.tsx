import type { ReactNode } from "react";

const PageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-14">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;