import { useEffect, useState, FormEvent } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { Post } from "../types";
import { Image as ImageIcon, Calendar, User, Search, X } from "lucide-react";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para a busca
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Carregar posts iniciais
  const loadDefaultPosts = () => {
    setLoading(true);
    api
      .get("/posts?sort=id,desc&size=10")
      .then((res) => {
        const data = res.data.content ? res.data.content : res.data;
        setPosts(data);
        setIsSearching(false);
      })
      .catch((err) => console.error("Erro ao carregar posts:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDefaultPosts();
  }, []);

  // Handler de Busca
  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadDefaultPosts();
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/posts/search?title=${searchTerm}`);
      const data = res.data.content ? res.data.content : res.data;
      setPosts(data);
      setIsSearching(true);
    } catch (error) {
      console.error("Erro na busca:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    loadDefaultPosts();
  };

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="font-sans text-gray-900">
      {/* Removido o <Header> antigo daqui */}

      <main className="container mx-auto px-6 py-8">
        {/* --- NOVA LOCALIZAÇÃO DA BARRA DE PESQUISA --- */}
        <div className="mb-10 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative group shadow-sm">
            <input
              type="text"
              placeholder="Buscar notícias..."
              className="w-full bg-white border border-gray-300 text-gray-700 rounded-full py-3 pl-6 pr-12 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-4 top-3 text-gray-400 group-focus-within:text-blue-600 hover:text-blue-800 transition"
            >
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Feedback visual da busca */}
        {isSearching && (
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-700">
              Resultados para:{" "}
              <span className="text-blue-600">"{searchTerm}"</span>
            </h2>
            <button
              onClick={clearSearch}
              className="flex items-center gap-2 text-sm text-red-600 hover:underline font-semibold"
            >
              <X size={16} /> Limpar busca
            </button>
          </div>
        )}

        {loading ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-gray-400">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p>Carregando conteúdo...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              Nenhum resultado encontrado.
            </p>
            {isSearching && (
              <button
                onClick={clearSearch}
                className="mt-4 text-blue-600 font-bold hover:underline"
              >
                Ver todas as notícias
              </button>
            )}
          </div>
        ) : (
          <>
            {/* --- MODO DE BUSCA (GRADE) --- */}
            {isSearching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition border border-gray-100 flex flex-col h-full"
                  >
                    <div className="h-48 overflow-hidden relative">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <ImageIcon size={32} />
                        </div>
                      )}
                      <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-black px-2 py-1 uppercase rounded">
                        {post.categoryName}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col grow">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-grow">
                        {post.content}
                      </p>
                      <div className="text-xs text-gray-400 font-bold uppercase mt-auto">
                        {post.author?.name}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* --- MODO PADRÃO (DESTAQUE + SIDEBAR) --- */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Destaque */}
                <div className="lg:col-span-8">
                  {featuredPost && (
                    <Link
                      to={`/post/${featuredPost.id}`}
                      className="group relative block h-[500px] w-full overflow-hidden rounded-xl shadow-xl"
                    >
                      {featuredPost.imageUrl ? (
                        <img
                          src={featuredPost.imageUrl}
                          alt={featuredPost.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                          <ImageIcon size={64} className="text-gray-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-8 w-full">
                        <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest mb-3 inline-block rounded">
                          {featuredPost.categoryName || "Destaque"}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-2 group-hover:text-blue-400 transition">
                          {featuredPost.title}
                        </h2>
                        <div className="flex items-center gap-4 text-gray-300 text-xs font-medium uppercase tracking-wide mt-4">
                          <span className="flex items-center gap-1">
                            <User size={14} /> {featuredPost.author?.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} /> Recente
                          </span>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  <h3 className="text-[#000914] font-black text-xl mb-2 uppercase tracking-tighter flex items-center gap-2 border-l-4 border-blue-600 pl-3">
                    Últimas
                  </h3>

                  {otherPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/post/${post.id}`}
                      className="group flex gap-4 bg-white p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition shadow-sm"
                    >
                      <div className="w-20 h-20 bg-gray-200 shrink-0 overflow-hidden relative rounded-md">
                        {post.imageUrl ? (
                          <img
                            src={post.imageUrl}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-blue-600 text-[10px] font-bold uppercase mb-1">
                          {post.categoryName}
                        </span>
                        <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-blue-700 transition line-clamp-3">
                          {post.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
