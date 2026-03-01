import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import BlankLayout from '../layout/blanckLayout';
import DashboardLayout from '../layout/dashboardLayout';

const SignInPage = lazy(() => import('@/modules/auth/pages/LoginPage'));
const HomePage = lazy(() => import('@/modules/home/HomePage'));
const BrandPage = lazy(() => import('@/modules/brands/BrandsPage'));
const ProductPage = lazy(() => import('@/modules/products/ProductsPage'));
const OpticalServicePage = lazy(() => import('@/modules/opticalservices/OpticalServicesPage'));
const ClientsPage = lazy(() => import('@/modules/clients/pages/ClientsPage'));
const ClientPrescriptionsPage = lazy(() => import('@/modules/clients/pages/ClientPrescriptionsPage'));
const ClientsBirthdaysPage = lazy(() => import('@/modules/clients/pages/ClientsBirthdaysPage'));
const ExpiringPrescriptionsPage = lazy(() => import('@/modules/clients/pages/ExpiringPrescriptionsPage'));

const SalesPage = lazy(() => import('@/modules/sales/pages/SalesPage'));
const SalesForm = lazy(() => import('@/modules/sales/pages/CreateSalePage'));
const SalesDetailsPage = lazy(() => import('@/modules/sales/pages/salesDetailsPage'));

const PaymentPage = lazy(() => import('@/modules/payments/pages/PaymentsPage'));
// const OverdueInstallmentsPage = lazy(() => import('@/modules/payments/pages/OverdueInstallmentsPage')); 
const ExpensesPage = lazy(() => import('@/modules/expenses/ExpensesPage'));

const DashboardPage = lazy(() => import('@/modules/dashboard/DashboardPage'));

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
                { index: true, element: <HomePage /> },
                { path: 'brands', element: <BrandPage /> },
                { path: 'products', element: <ProductPage /> },
                { path: 'services', element: <OpticalServicePage /> },
                { path: 'clients', element: <ClientsPage /> },
                { path: 'clients-birthday', element: <ClientsBirthdaysPage /> },
                { path: 'expiring-prescriptions', element: <ExpiringPrescriptionsPage /> },
                { path: 'clients/:id/prescriptions', element: <ClientPrescriptionsPage /> },

                { path: 'sales', element: <SalesPage /> },
                { path: 'sales/new', element: <SalesForm /> },
                { path: 'sales/edit/:id', element: <SalesForm /> },
                { path: 'sales/:id', element: <SalesDetailsPage /> },

                { path: 'payments', element: <PaymentPage /> },
                { path: 'expenses', element: <ExpensesPage /> },
                // { path: 'overdue-installments', element: <OverdueInstallmentsPage /> }, 

                {path: "dashboard", element: <DashboardPage />}
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
