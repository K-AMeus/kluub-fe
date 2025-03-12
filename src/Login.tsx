import { FC, useState, useEffect, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./authentication/AuthContext";
import "./index.css";
import Footer from "./shared/Footer";

const Login: FC = () => {
  const { login, signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setIsLogin(searchParams.get("mode") !== "signup");
  }, [location]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate("/");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.classList.add("landing-page-no-scroll");
    return () => {
      document.body.classList.remove("landing-page-no-scroll");
    };
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // SVG for Google Logo
  const GoogleLogoSVG: FC = () => (
    <svg
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 533.5 544.3"
    >
      <path
        fill="#4285F4"
        d="M533.5 278.4c0-17.4-1.5-34.1-4.4-50.3H272v95.1h147.4c-6.4 34.5-25 63.7-53.4 83.2v68h86.4c50.6-46.7 80-115.3 80-196.9z"
      />
      <path
        fill="#34A853"
        d="M272 544.3c72.4 0 133.1-23.9 177.5-64.9l-86.4-68c-24.1 16.2-55.2 25.7-91.1 25.7-69.8 0-129.1-47-150.4-110.3h-89v69.5c44.2 87.3 133.8 148.3 239.4 148.3z"
      />
      <path
        fill="#FBBC05"
        d="M121.6 324.3c-10.5-31.4-10.5-65 0-96.4v-69.5h-89c-32.3 63.3-32.3 138.3 0 201.6l89-36.7z"
      />
      <path
        fill="#EA4335"
        d="M272 107.7c38.8 0 73.6 13.4 101.3 39.7l75.8-75.8C411.1 24 350.4 0 272 0 167.4 0 77.8 61 33.6 148.3l89 36.7c21.3-63.3 80.6-110.3 150.4-110.3z"
      />
    </svg>
  );

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center pb-20">
      {/* Container for front and back rectangles */}
      <div className="relative w-full max-w-xl">
        {/* Back Rectangle */}
        <div className="absolute top-0 left-0 w-full h-full bg-[#E4DD3B] translate-x-2 translate-y-2 z-0"></div>

        {/* Front Rectangle */}
        <div className="relative z-10 w-full bg-black border-2 border-white p-8">
          {/* Header with Tabs */}
          <div className="flex justify-between border-b-2 border-white pb-4">
            <button
              className={`text-white font-dela-gothic-one sm:text-3xl text-2xl focus:outline-none ${
                isLogin ? "border-b-2 border-[#E4DD3B]" : ""
              }`}
              onClick={() => setIsLogin(true)}
            >
              LOG IN
            </button>
            <button
              className={`text-white font-dela-gothic-one sm:text-3xl text-2xl focus:outline-none ${
                !isLogin ? "border-b-2 border-[#E4DD3B]" : ""
              }`}
              onClick={() => setIsLogin(false)}
            >
              REGISTER
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 mt-4">{error}</p>}

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4 text-left">
              <label
                htmlFor="email"
                className="block text-white font-montserrat-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-3 bg-[#1B1B1B] text-white focus:outline-none focus:ring-2 focus:ring-[#E4DD3B]"
                required
              />
            </div>
            <div className="mb-4 text-left">
              <label
                htmlFor="password"
                className="block text-white font-montserrat-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 bg-[#1B1B1B] text-white focus:outline-none focus:ring-2 focus:ring-[#E4DD3B]"
                required
              />
            </div>

            {!isLogin && (
              <div className="mb-4 text-left">
                <label
                  htmlFor="confirmPassword"
                  className="block text-white font-montserrat-medium mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full p-3 bg-[#1B1B1B] text-white focus:outline-none focus:ring-2 focus:ring-[#E4DD3B]"
                  required
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-center space-x-4 mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-40 h-10 ${
                  loading ? "bg-gray-400" : "bg-[#E4DD3B] hover:bg-yellow-300"
                } text-black text-lg font-montserrat-medium transition-colors duration-200 flex items-center justify-center`}
              >
                {loading ? "Loading..." : isLogin ? "Log In" : "Register"}
              </button>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className={`w-40 h-10 ${
                  loading ? "bg-gray-200" : "bg-white hover:bg-gray-200"
                } text-black text-lg font-montserrat-medium transition-colors duration-200 flex items-center justify-center`}
              >
                <GoogleLogoSVG />
                <span className="ml-2">Google</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="absolute bottom-12 left-0 w-full z-50">
        <Footer />
      </div>
    </div>
  );
};

export default Login;
