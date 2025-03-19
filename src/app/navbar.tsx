'use client'

import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import UserDropdown from "@/components/UserDropdown";
import { SignInModal } from "@/components/SignInModal";

export default function Navbar() {
    const { data: session } = useSession();
    const [showSignInModal, setShowSignInModal] = useState(false);

    return (
        <>
            <SignInModal showSignInModal={showSignInModal} setShowSignInModal={setShowSignInModal} />
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg w-full sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 border-b border-white/10"
            >
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <motion.div
                            className="text-xl font-bold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <a href="/" className="hover:text-white/90 transition-colors">
                                YouTibee
                            </a>
                        </motion.div>
                        <div className="flex items-center gap-4">
                            {session && (
                                <motion.p
                                    className="hidden sm:block text-white/90 font-medium"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
                                >
                                    Welcome, {session.user.name} 👋
                                </motion.p>
                            )}
                            {session ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                                >
                                    <UserDropdown session={session} />
                                </motion.div>
                            ) : (
                                <motion.button
                                    title="User"
                                    className="text-white/90 hover:text-white rounded-full p-2 hover:bg-white/10 transition-all duration-200"
                                    onClick={() => setShowSignInModal(true)}
                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    <User className="w-6 h-6" />
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.nav>
        </>
    );
}
