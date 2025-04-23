import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import { createTheme, ThemeContext } from './components/hooks/useTheme';
import { Toaster } from './components/sonner';
import Home from './pages/home';
import NotFound from './pages/notfound';

const App = () => {
  const theme = createTheme();

  return (
    <ThemeContext.Provider value={theme}>
      <div data-theme={theme.theme}>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
