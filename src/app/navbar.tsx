'use client'

import { useSignInModal } from "@/components/sign-in-modal";
import UserDropdown from "@/components/user-dropdown";
import { User } from "lucide-react";
import { Session } from "next-auth";
import { memo } from "react";


const NavBar = memo(function NavBar({ session }: { session: Session | null }) {
    const { SignInModal, setShowSignInModal } = useSignInModal();

    return (
        <>
            <SignInModal />
            <nav className="bg-gray-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                <div className="text-lg font-bold">
                <a href="/" className="hover:text-gray-300">
                    Youtibee
                </a>
                </div>
                <div className="flex items-center space-x-4"></div>
                {session && (
                    <p className="hidden sm:block">
                    Welcome, {session.user.name} 👋
                    </p>
                )}
                {session ? (
                    <UserDropdown session={session} />
                ) : (
                    <button
                    title="User"
                    className="text-gray-300 hover:text-white rounded-full p-2"
                    onClick={() => setShowSignInModal(true)}
                    >
                    <User className="w-6 h-6" />
                    </button>
                )}
                </div>
            </nav>
        </>
    );
});

export default NavBar
