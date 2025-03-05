import './App.css'
import LoginForm from './LoginForm.tsx'
import {AuthProvider} from "./authentication/AuthContext.tsx";

function App() {
    return (
        <AuthProvider>
            <LoginForm />
        </AuthProvider>
    );
}

export default App
