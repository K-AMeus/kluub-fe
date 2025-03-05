// LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from './authentication/AuthContext';
import {getAllEvents} from "./shared/reducers/event.ts";

const LoginForm = () => {
    const { login, signup, signInWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        const res = await getAllEvents(0, 10);
        console.log(res);
        e.preventDefault();
        setError(null);
        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await signup(email, password);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" onClick={handleLogin}>Log In</button>
                <button type="button" onClick={handleSignup}>Sign Up</button>
            </form>
            <button onClick={signInWithGoogle}>Log in with Google</button>
        </div>
    );
};

export default LoginForm;
