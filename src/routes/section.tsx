import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import BlankLayout from '../layout/blanckLayout';
import DashboardLayout from '../layout/dashboardLayout';

const SignInPage = lazy(() => import('@/pages/login'));
//const CustomersPage = lazy(() => import('@/pages/cliente/clienteIndex'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const BrandPage = lazy(() => import('@/pages/BrandsPage'));

const renderFallback = (
    <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
        <LinearProgress
            sx={{
                width: 1,
                maxWidth: 320,
                bgcolor: (theme) => theme.palette.grey[200],
                [`& .${linearProgressClasses.bar}`]: { bgcolor: 'primary.main' },
            }}
        />
    </Box>
);

export function PrivateRouter() {
    return useRoutes([
        {
            path: '/',
            element: (
                <DashboardLayout>
                    <Suspense fallback={renderFallback}>
                        <Outlet />
                    </Suspense>
                </DashboardLayout>
            ),
            children: [
                { index: true, element: <DashboardPage /> },
                { path: 'brands', element: <BrandPage /> },
            ],
        },
        { path: '*', element: <Navigate to="/" replace /> },
    ]);
}

export function PublicRouter() {
    return useRoutes([
        {
            path: '/',
            element: (
                <BlankLayout>
                    <Suspense fallback={renderFallback}>
                        <SignInPage />
                    </Suspense>
                </BlankLayout>
            ),
        },
        { path: '*', element: <Navigate to="/" replace /> },
    ]);
}
