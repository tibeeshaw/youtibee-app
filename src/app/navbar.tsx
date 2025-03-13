'use client'

import useAuth from "../hooks/useAuth";

export default function Navbar() {
    const user = useAuth();

    return (
        <nav>
            {user ? (
                <div>
                    <p>Welcome, {user.profile?.displayName} 👋</p>
                    <a href={`${process.env.API_URL}/logout`}>Logout</a>
                </div>
            ) : (
                <a href={`${process.env.API_URL}/auth/google`}>Login with Google</a>
            )}
        </nav>
    );
}
