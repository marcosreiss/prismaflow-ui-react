import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import BlankLayout from '../layout/blanckLayout';
import DashboardLayout from '../layout/dashboardLayout';

const SignInPage = lazy(() => import('@/modules/auth/pages/login'));
const DashboardPage = lazy(() => import('@/modules/dashboard/DashboardPage'));
const BrandPage = lazy(() => import('@/modules/brands/BrandsPage'));
const ProductPage = lazy(() => import('@/modules/products/ProductsPage'));
const OpticalServicePage = lazy(() => import('@/modules/opticalservices/OpticalServicesPage'));
const ClientsPage = lazy(() => import('@/modules/clients/pages/ClientsPage'));
const ClientPrescriptionsPage = lazy(() => import('@/modules/clients/pages/ClientPrescriptionsPage'));


const SalesPage = lazy(() => import('@/modules/sales/pages/SalesPage'));
const SalesForm = lazy(() => import('@/modules/sales/pages/SalesFormPage'));
const SalesDetailsPage = lazy(() => import('@/modules/sales/pages/salesDetailsPage'));


const PaymentPage = lazy(() => import('@/modules/payments/PaymentsPage'));

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
                { path: 'services', element: <OpticalServicePage /> },
                { path: 'clients', element: <ClientsPage /> },
                { path: 'clients/:id/prescriptions', element: <ClientPrescriptionsPage /> },

                { path: 'sales', element: <SalesPage /> },
                { path: 'sales/new', element: <SalesForm /> }, // ✅ CRIAÇÃO
                { path: 'sales/edit/:id', element: <SalesForm /> }, // ✅ EDIÇÃO
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