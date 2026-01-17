import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-[#000914] text-white sticky top-0 z-50 border-b border-gray-800 shadow-md">
      {/* Alterei para 'justify-center' para o logo ficar centralizado. 
          Se preferir ele na esquerda, use 'justify-start'. */}
      <div className="container mx-auto px-6 py-4 flex justify-center items-center">
        {/* Logo */}
        <Link to="/" className="group">
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-blue-400 transition-all cursor-pointer">
            PLAYREPORT<span className="text-blue-500">.</span>
          </h1>
        </Link>

        {/* O botão 'Área Restrita' foi removido daqui */}
      </div>
    </header>
  );
}
