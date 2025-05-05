import Login from './components/login/login'
import './App.css'
import '@fontsource/inter';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import { BrowserRouter, Routes, Route, data } from 'react-router-dom';
import Cronograma from './components/cronograma/cronograma';
import Reportes from './components/cronograma/Reporte/reportes';
import Signup from './components/login/signup/signup';



function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cronograma" element={<Cronograma />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
