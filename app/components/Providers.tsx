'use client';

import { ImageKitProvider } from '@imagekit/next';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';


interface ProviderProps {
  children: ReactNode;
}

export default function Provider({ children }: ProviderProps) {
  return (
    <SessionProvider>

    <ImageKitProvider
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
      >
      {children}
    </ImageKitProvider>
        </SessionProvider>
  );
}