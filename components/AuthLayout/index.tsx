'use client';
import { useCurrentUser, useUserLoader } from '@/store/user.store';
import { Loader } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import classes from '@/styles/loader.module.css';
import apiClient from '@/utils/axios.util';
import { ApiRoutes } from '@/utils/routes.util';
import toast from 'react-hot-toast';
import { HeaderMegaMenu } from '../Header';

export const AuthLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const { user, setUser } = useCurrentUser();
  const { userLoading, setUserLoading } = useUserLoader();
  const [playgroundText, setPlaygroundText] = useState<string>('');
  const pathname = usePathname();

  const getAndSetSignedInUser = async () => {
    setUserLoading(true);
    try {
      const response = await apiClient.get(ApiRoutes.auth.self());
      setUser(response.data.data.user);
      setUserLoading(false);
    } catch (error) {
      const path = window.location.pathname;
      if (path != '/login' && path != '/signup') {
        router.push('/login');
        toast.error('Please login to continue.');
      }
      setUserLoading(false);
    }
  };

  useEffect(() => {
    if (pathname.includes('playground')) setPlaygroundText('Playground');
    else setPlaygroundText('');

    if (!user) getAndSetSignedInUser();
    return () => {};
  }, [user, pathname]);

  return userLoading ? (
    <div className={classes.loadingContainer}>
      <Loader />
      Hold on a sec...
    </div>
  ) : (
    <>
      <HeaderMegaMenu playgroundText={playgroundText} />
      <div
        style={{
          height: playgroundText.length > 0 ? '91.5vh' : '93vh',
        }}
      >
        {children}
      </div>
    </>
  );
};
