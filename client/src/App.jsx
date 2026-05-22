import { ProveedorAuth } from "./context/ProveedorAuth.jsx";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import Rutas from "./routes/Rutas.jsx";

function App() {
  return (
    <ProveedorAuth>
      <Header />
      <Rutas />
      <Footer />
    </ProveedorAuth>
  );
}

export default App;
