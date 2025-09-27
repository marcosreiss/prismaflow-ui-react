import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import '@fontsource/poppins/600.css';   // títulos
import '@fontsource/inter/400.css';     // body
import '@fontsource/inter/500.css';


import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { NotificationProvider } from './context/NotificationContext.tsx';
import { ThemeProvider } from '@emotion/react';
import { prismaTheme } from './design-system/theme/prismaTheme.ts';
import PFToast from './design-system/components/pfnotifications/PFToast.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider theme={prismaTheme}>
            <NotificationProvider>
              <Suspense>
                <App />
                <PFToast />
              </Suspense>
            </NotificationProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);