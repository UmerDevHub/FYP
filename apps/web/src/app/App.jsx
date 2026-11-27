import { BrowserRouter, Route, Routes } from 'react-router';

function HomePage() {
  return (
    <main>
      <h1>Vehicle 360</h1>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
