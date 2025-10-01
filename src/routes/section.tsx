import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import BlankLayout from '../layout/blanckLayout';
import DashboardLayout from '../layout/dashboardLayout';

const SignInPage = lazy(() => import('@/pages/login'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const BrandPage = lazy(() => import('@/pages/BrandsPage'));
const ProductPage = lazy(() => import('@/pages/ProductsPage'));
const ServicePage = lazy(() => import('@/pages/ServicePage'));
const CustomerPage = lazy(() => import('@/pages/CustomerPage'));


const SalesPage = lazy(() => import('@/pages/SalePage'));
const SalesForm = lazy(() => import('@/pages/SalesForm'));
const SalesDetailsPage = lazy(() => import('@/pages/salesDetailsPage'));


const PaymentPage = lazy(() => import('@/pages/PaymentsPage'));

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
                { path: 'products', element: <ProductPage /> },
                { path: 'services', element: <ServicePage /> },
                { path: 'customers', element: <CustomerPage /> },

                { path: 'sales', element: <SalesPage /> },
                { path: 'sales/new', element: <SalesForm /> }, // ✅ CRIAÇÃO
                { path: 'sales/edit/:id', element: <SalesForm mode="edit" /> }, // ✅ EDIÇÃO
                { path: 'sales/:id', element: <SalesDetailsPage /> },

                { path: 'payments', element: <PaymentPage /> },
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