'use client'

import { useSignInModal } from "@/components/sign-in-modal";
import UserDropdown from "@/components/user-dropdown";
import { User } from "lucide-react";
import { Session } from "next-auth";
import { memo } from "react";


const NavBar = memo(function NavBar({ session }: { session: Session | null }) {
    const { SignInModal, setShowSignInModal } = useSignInModal();

    console.log(session);

    return (
        <>
            <SignInModal />
            <nav>
                {/* {user ? (
                <div>
                    <p>Welcome, {user.profile?.displayName} 👋</p>
                    <a href={`${process.env.NEXT_PUBLIC_API_URL}/logout`}>Logout</a>
                </div>
            ) : (
                <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>Login with Google</a>
            )} */}

                {session ? (
                    <UserDropdown session={session} />
                ) : (
                    <button
                        title="User"
                        className="text-primary-900 hover:text-primary-900/80 dark:text-white/80 dark:hover:text-white mr-1 rounded-full"
                        onClick={() => setShowSignInModal(true)}
                    >
                        <User className="m-1" />
                    </button>
                )}

            </nav>
        </>
    );
});

export default NavBar
