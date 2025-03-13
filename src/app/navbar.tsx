'use client'

import useAuth from "../hooks/useAuth";

export default function Navbar() {
    const user = useAuth();

    return (
        <nav>
            {user ? (
                <div>
                    <p>Welcome, {user.profile?.displayName} 👋</p>
                    <a href="http://localhost:3000/api/logout">Logout</a>
                </div>
            ) : (
                <a href="http://localhost:3000/api/auth/google">Login with Google</a>
            )}
        </nav>
    );
}
