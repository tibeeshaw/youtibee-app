'use client';

import { Dispatch, SetStateAction } from 'react';
import { cn } from '@/lib/utils';
import { Drawer } from 'vaul';
import * as Dialog from '@radix-ui/react-dialog';
import useMediaQuery from '@/lib/hooks/use-media-query';

export default function Modal({
  children,
  className,
  showModal,
  setShowModal,
}: {
  children: React.ReactNode;
  className?: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { isMobile } = useMediaQuery();

  if (isMobile) {
    return (
      <Drawer.Root open={showModal} onOpenChange={setShowModal}>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-primary-100 bg-opacity-10 backdrop-blur-sm" />
        <Drawer.Portal>
          <Drawer.Content
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50 mt-24 rounded-t-[10px] border-t border-primary-200 bg-white',
              className,
            )}
          >
            <Dialog.Title className="sr-only" />
            <Dialog.Description className="sr-only">sign in</Dialog.Description>
            <div className="sticky top-0 z-20 flex w-full items-center justify-center rounded-t-[10px] bg-inherit">
              <div className="my-3 h-1 w-12 rounded-full bg-primary-300" />
            </div>
            {children}
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }
  return (
    <Dialog.Root open={showModal} onOpenChange={setShowModal}>
      <Dialog.Portal>
        <Dialog.Overlay
          // for detecting when there's an active opened modal
          id="modal-backdrop"
          className="animate-fade-in fixed inset-0 z-40 bg-primary-100 bg-opacity-50 backdrop-blur-md"
        />
        <Dialog.Content
          aria-description="sign in"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={cn(
            'animate-scale-in fixed inset-0 z-40 m-auto max-h-fit w-full max-w-md overflow-hidden border border-primary-200 bg-white p-0 shadow-xl md:rounded-2xl',
            className,
          )}
        >
          <Dialog.Title className="sr-only">sign in</Dialog.Title>
          <Dialog.Description className="sr-only">sign in</Dialog.Description>

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
