import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ROLE } from '@v360/shared/constants';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router';
import AccountPage from '../features/account/AccountPage.jsx';
import NotificationsPage from '../features/account/NotificationsPage.jsx';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage.jsx';
import LoginPage from '../features/auth/LoginPage.jsx';
import RegisterPage from '../features/auth/RegisterPage.jsx';
import ResetPasswordPage from '../features/auth/ResetPasswordPage.jsx';
import MyRequestsPage from '../features/sell/MyRequestsPage.jsx';
import SellYourCarPage from '../features/sell/SellYourCarPage.jsx';
import ArrivalPage from '../features/staff/ArrivalPage.jsx';
import SellRequestsPage from '../features/staff/SellRequestsPage.jsx';
import { AuthProvider } from './AuthProvider.jsx';
import { RequireLogin, RequireRole } from './guards.jsx';
import KitPage from './KitPage.jsx';
import { CustomerLayout, PublicLayout, StaffLayout } from './layouts.jsx';
import { ErrorPage, LayoutNamePage, NotFoundPage } from './pages.jsx';

const BRANCH_STAFF = [ROLE.SALES_STAFF, ROLE.BRANCH_MANAGER];

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

// A page that needs a login, and (when roles are given) one of those roles.
// The server checks the same again on every request.
function guard(page, roles) {
  if (!roles) {
    return <RequireLogin>{page}</RequireLogin>;
  }
  return (
    <RequireLogin>
      <RequireRole roles={roles}>{page}</RequireRole>
    </RequireLogin>
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
          { path: 'sell', element: guard(<SellYourCarPage />, [ROLE.CUSTOMER]) },
          { path: 'my-requests', element: guard(<MyRequestsPage />, [ROLE.CUSTOMER]) },
          { path: 'account', element: guard(<AccountPage />) },
          { path: 'notifications', element: guard(<NotificationsPage />) },
        ],
      },
      {
        Component: StaffLayout,
        children: [
          { path: 'staff', element: <Navigate to="/staff/sell-requests" replace /> },
          { path: 'staff/sell-requests', element: guard(<SellRequestsPage />, BRANCH_STAFF) },
          { path: 'staff/arrivals/new', element: guard(<ArrivalPage />, [ROLE.SALES_STAFF]) },
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
