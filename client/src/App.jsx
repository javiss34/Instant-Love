import ProveedorSesion from "./context/ProveedorSesion.jsx";
import ProveedorPerfiles from "./context/ProveedorPerfiles.jsx";
import ProveedorBusqueda from "./context/ProveedorBusqueda.jsx";
import ProveedorVideollamada from "./context/ProveedorVideollamada.jsx";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import Rutas from "./routes/Rutas.jsx";

function App() {
  return (
    <ProveedorSesion>
      <ProveedorPerfiles>
        <ProveedorBusqueda>
          <ProveedorVideollamada>
            <Header />
            <Rutas />
            <Footer />
          </ProveedorVideollamada>
        </ProveedorBusqueda>
      </ProveedorPerfiles>
    </ProveedorSesion>
  );
}

export default App;
