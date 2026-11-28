import { ROLE } from '@v360/shared/constants';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';
import { AuthProvider } from './AuthProvider.jsx';
import { RequireLogin, RequireRole } from './guards.jsx';
import KitPage from './KitPage.jsx';
import { CustomerLayout, PublicLayout, StaffLayout } from './layouts.jsx';
import { ErrorPage, LayoutNamePage, NotFoundPage } from './pages.jsx';

const STAFF_ROLES = [ROLE.SALES_STAFF, ROLE.BRANCH_MANAGER, ROLE.ADMIN];

// The kit page is for the team only: a production build has no /kit address.
const developmentRoutes = import.meta.env.DEV ? [{ path: 'kit', Component: KitPage }] : [];

// AuthProvider sits inside the router, because it sends people to /login.
function Root() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
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
        children: [{ index: true, element: <LayoutNamePage layoutName="Public" /> }],
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
