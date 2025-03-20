'use client';

import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import Popover from './popover';

export default function UserDropdown({ session }: { session: any }) {
  const [openPopover, setOpenPopover] = useState(false);
  const { data: sessionData } = useSession();
  const email = sessionData?.user?.email;
  const image = sessionData?.user?.image;

  return (
    <div className="relative inline-block text-left flex items-center">
      <Popover
        content={
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full rounded-lg bg-gradient-to-br from-blue-600/90 to-purple-600/90 backdrop-blur-sm p-2 shadow-xl border border-white/10 sm:w-56"
          >
            <div className="p-2">
              {session?.user?.name && (
                <p className="truncate text-sm font-medium text-white">
                  {session?.user?.name}
                </p>
              )}
              <p className="truncate text-sm text-white/70">
                {session?.user?.email}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-colors hover:bg-white/10 cursor-pointer"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 text-white/70" />
              <p className="text-sm text-white/70">Logout</p>
            </motion.button>
          </motion.div>
        }
        align="end"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <motion.button
          onClick={() => setOpenPopover(!openPopover)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-all duration-200 focus:outline-none cursor-pointer sm:h-9 sm:w-9"
        >
          <img
            alt={email || 'user email'}
            src={image || `https://avatars.dicebear.com/api/micah/${email}.svg`}
            width={40}
            height={40}
            className="rounded-full"
          />
        </motion.button>
      </Popover>
    </div>
  );
}
