import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { QueryExecution } from "./pages/QueryExecution";
import { Results } from "./pages/Results";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="query/:id" element={<QueryExecution />} />
          <Route path="results/:id" element={<Results />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
