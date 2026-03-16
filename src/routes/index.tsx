import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';

import type { Enquiry } from '#/types';
import type { ColumnDef } from '#/components/table';
import useEnquiries from '#/hooks/use-enquiry';
import { Spinner } from '#/components/spinner';
import Table from '#/components/table';
import useEnquiriesStore from '#/stores/enquires-store';

export const Route = createFileRoute('/')({ component: App });

const columns: ColumnDef<Enquiry>[] = [
	{ key: 'id', label: 'ID' },
	{ key: 'customerName', label: 'Customer', sortable: true },
	{ key: 'partRequested', label: 'Part', sortable: false },
	{
		key: 'dateSubmitted',
		label: 'Date',
		sortable: true,
		render: (v) => (
			<span className='island-kicker text-[var(--lagoon-deep)]'>
				{format(new Date(`${v}`), 'dd - MMM - yyyy')}
			</span>
		)
	},
	{
		key: 'status',
		label: 'Status',
		sortable: true,
		render: (v) => (
			<span className='island-kicker text-[var(--lagoon-deep)]'>{String(v)}</span>
		)
	},
	{ key: 'company', label: 'Company', sortable: true },
	{
		key: 'dealValue',
		label: 'Deal (£)',
		sortable: true,
		render: (v) => `£${Number(v).toLocaleString()}`
	},
	{
		key: 'score',
		label: 'Score',
		sortable: true,
		render: (v) => (
			<span className='rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--palm)]'>
				{String(v)}
			</span>
		)
	}
];

function App() {
	const enquires = useEnquiriesStore((s) => s.enquiries);

	const { isLoading } = useEnquiries({ syncStore: true });

	return (
		<main className='p-4'>
			{isLoading ? (
				<Spinner className='mx-auto mt-12' />
			) : (
				<Table
					data={enquires}
					columns={columns}
					filterPlaceholder='Search enquiries...'
					filterKeys={['customerName', 'partRequested']}
				/>
			)}
		</main>
	);
}
