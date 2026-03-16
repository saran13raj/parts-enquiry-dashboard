import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';

import { router } from './router';
import * as TanStackQueryProvider from './providers/tanstack-query';
import './styles.css';

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();

ReactDOM.createRoot(document.getElementById('app')!).render(
	<StrictMode>
		<TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
			<RouterProvider router={router} />
		</TanStackQueryProvider.Provider>
	</StrictMode>
);
