import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ROLE } from '@v360/shared/constants';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage.jsx';
import LoginPage from '../features/auth/LoginPage.jsx';
import RegisterPage from '../features/auth/RegisterPage.jsx';
import ResetPasswordPage from '../features/auth/ResetPasswordPage.jsx';
import { AuthProvider } from './AuthProvider.jsx';
import { RequireLogin, RequireRole } from './guards.jsx';
import KitPage from './KitPage.jsx';
import { CustomerLayout, PublicLayout, StaffLayout } from './layouts.jsx';
import { ErrorPage, LayoutNamePage, NotFoundPage } from './pages.jsx';

const STAFF_ROLES = [ROLE.SALES_STAFF, ROLE.BRANCH_MANAGER, ROLE.ADMIN];

// The kit page is for the team only: a production build has no /kit address.
const developmentRoutes = import.meta.env.DEV ? [{ path: 'kit', Component: KitPage }] : [];

// Server data lives in TanStack Query (apps/web/CLAUDE.md).
const queryClient = new QueryClient();

// AuthProvider sits inside the router, because it sends people to /login.
function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Every address of the app. A layout route has no path: it only wraps the pages inside it.
const router = createBrowserRouter([
  {
    Component: Root,
    ErrorBoundary: ErrorPage,
    children: [
      {
        Component: PublicLayout,
        children: [
          { index: true, element: <LayoutNamePage layoutName="Public" /> },
          { path: 'login', Component: LoginPage },
          { path: 'register', Component: RegisterPage },
          { path: 'forgot-password', Component: ForgotPasswordPage },
          { path: 'reset-password', Component: ResetPasswordPage },
        ],
      },
      {
        Component: CustomerLayout,
        children: [
          {
            path: 'sell',
            element: (
              <RequireLogin>
                <RequireRole roles={[ROLE.CUSTOMER]}>
                  <LayoutNamePage layoutName="Customer" />
                </RequireRole>
              </RequireLogin>
            ),
          },
          {
            path: 'account',
            element: (
              <RequireLogin>
                <LayoutNamePage layoutName="Customer" />
              </RequireLogin>
            ),
          },
        ],
      },
      {
        Component: StaffLayout,
        children: [
          {
            path: 'staff',
            element: (
              <RequireLogin>
                <RequireRole roles={STAFF_ROLES}>
                  <LayoutNamePage layoutName="Staff" />
                </RequireRole>
              </RequireLogin>
            ),
          },
        ],
      },
      ...developmentRoutes,
      { path: '*', Component: NotFoundPage },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
