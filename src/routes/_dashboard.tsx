import { createFileRoute, Outlet } from '@tanstack/react-router';

// shell for dashboard
export const Route = createFileRoute('/_dashboard')({
	component: () => <Outlet />
});
