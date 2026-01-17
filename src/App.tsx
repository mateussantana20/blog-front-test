import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext, JSX } from "react";

// Páginas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import UsersPage from "./pages/Users";
import PostForm from "./pages/PostForm";
import PostDetails from "./pages/PostDetails";

// Componentes Globais
import Header from "./components/Header";
import Footer from "./components/Footer";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading)
    return (
      <div className="flex h-screen justify-center items-center">
        Carregando...
      </div>
    );
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* 1. Wrapper Flexbox para empurrar o footer */}
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Header /> {/* 2. Header Global */}
          {/* 3. Main com flex-1 para ocupar o espaço vazio */}
          <main className="flex-1">
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/post/:id" element={<PostDetails />} />
              <Route path="/login" element={<Login />} />

              {/* Rotas Privadas (Admin) */}
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              {/* Novas Rotas de Gerenciamento */}
              <Route
                path="/admin/categories"
                element={
                  <PrivateRoute>
                    <Categories />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <PrivateRoute>
                    <UsersPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin/new-post"
                element={
                  <PrivateRoute>
                    <PostForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/edit-post/:id"
                element={
                  <PrivateRoute>
                    <PostForm />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer /> {/* 4. Footer Global sempre no final */}
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
