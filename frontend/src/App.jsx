import { useState, useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageLoader from "./components/PageLoader";
import AuthModal from "./components/AuthModal";
import { getStoredUser, removeToken, getMeAPI, getToken } from "./services/api";
import { lazyWithDelay } from "./utils/lazyWithDelay";
import "./App.css";

// Eager landing page
import Home from "./pages/Home";

// Practical 8: Route-based Code Splitting using React.lazy() and anti-flicker delay
const Projects = lazyWithDelay(() => import("./pages/Projects"), 250);
const Repositories = lazyWithDelay(() => import("./pages/Repositories"), 250);
const Tasks = lazyWithDelay(() => import("./pages/Tasks"), 250);
const Contact = lazyWithDelay(() => import("./pages/Contact"), 250);
const NotFound = lazyWithDelay(() => import("./pages/NotFound"), 250);

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
          <Suspense fallback={<PageLoader message="Loading page component on demand..." />}>
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
          </Suspense>
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
