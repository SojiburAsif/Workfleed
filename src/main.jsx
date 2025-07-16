import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import { router } from './Router/Router.jsx';
import App from './App.jsx';
import AuthProvider from './Page/Auth/AuthProvider.jsx';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <div className="font-Tektur">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </div>
  </StrictMode>,
);
