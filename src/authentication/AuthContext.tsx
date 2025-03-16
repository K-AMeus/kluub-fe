import {
  createContext,
  useEffect,
  useState,
  useContext,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
  User,
  GoogleAuthProvider,
  getIdTokenResult,
} from "firebase/auth";
import { firebaseAuth } from "./firebaseConfig";

interface AuthContextProps {
  user: User | null;
  isAdmin: boolean;
  idToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          const token = await currentUser.getIdToken(true);
          setIdToken(token);
          const tokenResult = await getIdTokenResult(currentUser);
          setIsAdmin(!!tokenResult.claims.admin);
        } else {
          setIdToken(null);
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(firebaseAuth, email, password);
  };

  const signup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(firebaseAuth, email, password);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(firebaseAuth, provider);
  };

  const logout = async () => {
    await signOut(firebaseAuth);
    setUser(null);
    setIdToken(null);
    setIsAdmin(false);
  };

  const LoadingFallback: React.FC = () => (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
    </div>
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        idToken,
        isAdmin,
        loading,
        login,
        signup,
        signInWithGoogle,
        logout,
      }}
    >
      {!loading ? children : <LoadingFallback />}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
