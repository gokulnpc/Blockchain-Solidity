import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import App1 from "./pages/App1"
import App2 from "./pages/App2"
import Blog from './components/Blog';
import Contact from './components/Contact';
import Nopage from './components/Nopage';
import Layout from './components/Layout';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App1 />} />
        <Route path="/:id" element={<App2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
