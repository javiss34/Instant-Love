const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-6">
      <div className="w-full px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
        <p className="font-medium">© 2026 <span className="text-rose-400 font-semibold">InstantLove</span> — Todos los derechos reservados</p>
        <div className="flex gap-5">
          <span className="hover:text-rose-400 cursor-pointer transition-colors">Privacidad</span>
          <span className="hover:text-rose-400 cursor-pointer transition-colors">Términos</span>
          <span className="hover:text-rose-400 cursor-pointer transition-colors">Contacto</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
