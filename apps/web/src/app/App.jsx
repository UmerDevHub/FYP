import { createBrowserRouter, RouterProvider } from 'react-router';
import { CustomerLayout, PublicLayout, StaffLayout } from './layouts.jsx';
import { ErrorPage, LayoutNamePage, NotFoundPage } from './pages.jsx';
import KitPage from './KitPage.jsx';

// The kit page is for the team only: a production build has no /kit address.
const developmentRoutes = import.meta.env.DEV ? [{ path: 'kit', Component: KitPage }] : [];

// Every address of the app. A layout route has no path: it only wraps the pages inside it.
const router = createBrowserRouter([
  {
    ErrorBoundary: ErrorPage,
    children: [
      {
        Component: PublicLayout,
        children: [{ index: true, element: <LayoutNamePage layoutName="Public" /> }],
      },
      {
        Component: CustomerLayout,
        children: [
          { path: 'sell', element: <LayoutNamePage layoutName="Customer" /> },
          { path: 'account', element: <LayoutNamePage layoutName="Customer" /> },
        ],
      },
      {
        Component: StaffLayout,
        children: [{ path: 'staff', element: <LayoutNamePage layoutName="Staff" /> }],
      },
      ...developmentRoutes,
      { path: '*', Component: NotFoundPage },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
