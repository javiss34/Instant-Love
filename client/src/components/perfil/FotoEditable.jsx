import { useState, useRef } from "react";

/* Componente que gestiona la interacción visual del ususario con su avatar */
const FotoEditable = ({ foto, nombre, subirFotoPerfil }) => {
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const inputFotoRef = useRef(null);

  /* Maneja la subida de fotos */
  const subirFoto = async (e) => {
    try {
      const archivo = e.target.files?.[0];
      if (!archivo) return;
      setSubiendoFoto(true);
      await subirFotoPerfil(archivo);
    } finally {
      setSubiendoFoto(false);
      e.target.value = "";
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputFotoRef.current?.click()}
        disabled={subiendoFoto}
        className="relative w-24 h-24 rounded-full shrink-0 group focus:outline-none"
        title="Cambiar foto de perfil"
      >
        <img
          src={foto}
          alt={nombre}
          className="w-24 h-24 rounded-full object-cover shadow-md"
        />
        {/* Cuando el usuario pasa el ratón por encima de la foto de perfil sale la camara y se oscurece */}
        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 group-disabled:opacity-100 transition-opacity">
          <span className="text-white text-xl">{subiendoFoto ? "⏳" : "📷"}</span>
        </div>
      </button>

      {/* Input oculto: se activa desde el botón de arriba */}
      <input
        ref={inputFotoRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={subirFoto}
      />
    </>
  );
};

export default FotoEditable;
