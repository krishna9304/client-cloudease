import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { theme } from '../theme';
import { Toaster } from 'react-hot-toast';
import { AuthLayout } from '@/components/AuthLayout';

export const metadata = {
  title: 'Cloudease | Whiteboard for the cloud',
  description: 'A whiteboard for the cloud',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#333',
              color: 'white',
            },
          }}
        />
        <MantineProvider theme={theme}>
          <AuthLayout>{children}</AuthLayout>
        </MantineProvider>
      </body>
    </html>
  );
}
