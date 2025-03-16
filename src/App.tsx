import React, { StrictMode, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./authentication/AuthContext.tsx";
import LandingPage from "./LandingPage.tsx";
import Header from "./shared/Header.tsx";
import PrivateRoute from "./authentication/PrivateRoute";
import ProtectedRoute from "./authentication/ProtectedRoute";

const Events = React.lazy(
  () => import(/* webpackPrefetch: true */ "./events/Events.tsx")
);
const Contact = React.lazy(
  () => import(/* webpackPrefetch: true */ "./Contact")
);
const Profile = React.lazy(
  () => import(/* webpackPrefetch: true */ "./Profile")
);
const Login = React.lazy(() => import(/* webpackPrefetch: true */ "./Login"));
const EventDetail = React.lazy(
  () => import(/* webpackPrefetch: true */ "./events/EventDetail")
);
const AdminPanel = React.lazy(() => import("./AdminPanel"));

const LoadingFallback: React.FC = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <StrictMode>
      <Router>
        <AuthProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Header />

            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/events" element={<Events />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Login />} />
              <Route path="/events/:id" element={<EventDetail />} />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<LandingPage />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </StrictMode>
  );
};

export default App;
