import ProveedorSesion from "./context/ProveedorSesion.jsx";
import ProveedorPerfiles from "./context/ProveedorPerfiles.jsx";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import Rutas from "./routes/Rutas.jsx";

function App() {
  return (
    <ProveedorSesion>
      <ProveedorPerfiles>
        <Header />
        <Rutas />
        <Footer />
      </ProveedorPerfiles>
    </ProveedorSesion>
  );
}

export default App;
