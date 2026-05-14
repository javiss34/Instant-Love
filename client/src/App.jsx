import { ProveedorSesion } from "./context/ProveedorSesion.jsx";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import Rutas from "./routes/Rutas.jsx";

function App() {
  return (
    <ProveedorSesion>
      <Header />
      <Rutas />
      <Footer />
    </ProveedorSesion>
  );
}

export default App;
