import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Repositories from "./pages/Repositories";
import Tasks from "./pages/Tasks";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AuthModal from "./components/AuthModal";
import { getStoredUser, removeToken, getMeAPI, getToken } from "./services/api";
import "./App.css";

function App() {
  const [user, setUser] = useState(getStoredUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Check token and sync user profile on load
  useEffect(() => {
    if (getToken()) {
      getMeAPI()
        .then((fetchedUser) => {
          setUser(fetchedUser);
        })
        .catch(() => {
          removeToken();
          setUser(null);
        });
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    setUser(null);
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
        />
        <main className="page-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/repositories" element={<Repositories />} />
            <Route
              path="/tasks"
              element={
                <Tasks
                  user={user}
                  onOpenAuth={() => setIsAuthOpen(true)}
                />
              }
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer company="AWDF Full-Stack Portfolio & Task Management" />

        {/* Global Auth Modal for Practical 7 */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
