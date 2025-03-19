import Google from '@/app/icons/google';
import LoadingDots from '@/app/icons/loading-dots';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import Modal from './modal';

export const SignInModal = ({
  showSignInModal,
  setShowSignInModal,
}: {
  showSignInModal: boolean;
  setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [signInClicked, setSignInClicked] = useState(false);

  return (
    <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
      <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-primary-200">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-primary-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
          <Link href="/">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 w-10 rounded-full"
              width={20}
              height={20}
            />
          </Link>
          <h3 className="font-display text-2xl font-bold">Sign In</h3>
          <p className="text-sm text-primary-500">
            Only your email and profile picture will be stored.
          </p>
        </div>

        <div className="flex flex-col space-y-4 bg-primary-50 px-4 py-8 md:px-16">
          <button
            disabled={signInClicked}
            className={`${signInClicked
                ? 'cursor-not-allowed border-primary-200 bg-primary-100'
                : 'border border-primary-200 bg-white text-black hover:bg-primary-50'
              } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-hidden`}
            onClick={() => {
              setSignInClicked(true);
              signIn('google');
            }}
          >
            {signInClicked ? (
              <LoadingDots color="#808080" />
            ) : (
              <>
                <Google className="h-5 w-5" />
                <p>Sign In with Google</p>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export function useSignInModal() {
  const [showSignInModal, setShowSignInModal] = useState(false);

  const SignInModalCallback = useCallback(() => {
    return (
      <SignInModal
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />
    );
  }, [showSignInModal, setShowSignInModal]);

  return useMemo(
    () => ({ setShowSignInModal, SignInModal: SignInModalCallback }),
    [setShowSignInModal, SignInModalCallback],
  );
}
