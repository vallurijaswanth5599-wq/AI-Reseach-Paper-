import { Outlet, useLocation } from 'react-router-dom';
import { EditorialHeader } from './EditorialHeader';
import { EditorialFooter } from './EditorialFooter';

export function EditorialLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="relative min-h-screen bg-[#0c0d12] text-neutral-200 antialiased selection:bg-rose-500/20 selection:text-rose-200">
      {/* Faint dusk glow at the top for inner pages (Home has its own full dusk sky hero) */}
      {!isHome && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[450px] opacity-75"
          style={{
            background:
              'radial-gradient(ellipse 70% 30% at 50% -10%, rgba(244, 167, 185, 0.09), rgba(251, 196, 171, 0.04), rgba(30, 38, 64, 0.12), transparent 75%)',
          }}
        />
      )}

      {/* Slim Top Bar */}
      <EditorialHeader />

      {/* Main Page Content */}
      <main className="relative z-10 mx-auto w-full">
        <Outlet />
      </main>

      {/* Universal Footer */}
      <EditorialFooter />
    </div>
  );
}
