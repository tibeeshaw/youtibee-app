import { useState, useEffect } from "react";

export default function useAuth() {
    const [user, setUser] = useState<{ profile: { displayName: string } } | null>(null);

    useEffect(() => {
        fetch("/api/me", {
            credentials: "include", // Important: Sends cookies
        })
            .then(async res => {
                if (res.status > 400) {
                    throw Error();
                }
                return res.json()
            })
            .then(data => setUser(data))
            .catch(() => setUser(null));
    }, []);

    return user;
}
