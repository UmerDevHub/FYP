import { createBrowserRouter, RouterProvider } from 'react-router';
import { CustomerLayout, PublicLayout, StaffLayout } from './layouts.jsx';
import { ErrorPage, LayoutNamePage, NotFoundPage } from './pages.jsx';
import TokensPage from './TokensPage.jsx';

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
      { path: 'tokens', Component: TokensPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
