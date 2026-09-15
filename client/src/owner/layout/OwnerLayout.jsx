import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import OwnerSidebar from "../components/owner/OwnerSidebar";

const OwnerLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAF5]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        {/* Desktop sidebar */}
        <aside className="hidden w-[260px] shrink-0 border-r border-[#E9EFE4] lg:block">
          <div className="sticky top-0 h-screen">
            <OwnerSidebar />
          </div>
        </aside>

        {/* Mobile sidebar (overlay) */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-ink/40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-[280px] shadow-2xl">
              <OwnerSidebar onClose={() => setMobileOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex min-h-screen w-full flex-col overflow-x-hidden">
          {/* Mobile topbar */}
          <div className="flex items-center gap-3 border-b border-[#E9EFE4] bg-white px-4 py-3 lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-ink hover:bg-[#F1F6EC]"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <p className="font-display text-sm font-extrabold text-ink">Owner Panel</p>
          </div>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default OwnerLayout;
