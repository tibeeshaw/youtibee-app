'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthSuccess() {
    const router = useRouter();

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get("token");

        if (token) {
            localStorage.setItem("authToken", token);
            router.push("/"); // Redirect after saving token
        }
    }, []);

    return <p>Authenticating...</p>;
}
