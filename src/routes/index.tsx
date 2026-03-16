import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';

import type { Enquiry } from '#/types';
import type { ColumnDef } from '#/components/table';
import { useEnquiries } from '#/hooks/use-enquiry';
import { Spinner } from '#/components/spinner';
import Table from '#/components/table';
import { useDashboardStore } from '#/stores/dashboard-store';
import { ClipboardList, Star, TrendingUp } from 'lucide-react';
import { StatsCard } from '#/components/stats-card';

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

const SummaryBar = ({
	filtered,
	total
}: {
	filtered: Enquiry[];
	total: number;
}) => {
	const count = filtered.length;
	const pipeline = filtered.reduce((sum, e) => sum + e.dealValue, 0);
	const avgScore = count
		? Math.round(filtered.reduce((sum, e) => sum + e.score, 0) / count)
		: 0;

	const stats = [
		{
			icon: <ClipboardList size={15} className='text-[var(--lagoon-deep)]' />,
			label: 'Enquiries',
			value: count === total ? count : `${count} / ${total}`
		},
		{
			icon: <TrendingUp size={15} className='text-[var(--lagoon-deep)]' />,
			label: 'Pipeline Value',
			value: `£${pipeline.toLocaleString()}`
		},
		{
			icon: <Star size={15} className='text-[var(--lagoon-deep)]' />,
			label: 'Avg Score',
			value: avgScore
		}
	];

	return (
		<div className='mb-4 grid grid-cols-3 gap-3'>
			{stats.map((stat) => (
				<StatsCard key={stat.label} {...stat} />
			))}
		</div>
	);
};

function App() {
	const enquiries = useDashboardStore((s) => s.enquiries);
	const filteredEnquiries = useDashboardStore((s) => s.filteredEnquiries);
	const setFilteredEnquiries = useDashboardStore((s) => s.setFilteredEnquiries);

	const { isLoading } = useEnquiries({ syncStore: true });

	return (
		<main className='p-4'>
			{isLoading ? (
				<Spinner className='mx-auto mt-12' />
			) : (
				<>
					<SummaryBar filtered={filteredEnquiries} total={enquiries.length} />
					<Table
						data={enquiries}
						columns={columns}
						filterPlaceholder='Search enquiries...'
						filterKeys={['customerName', 'partRequested']}
						onFilteredDataChange={setFilteredEnquiries}
					/>
				</>
			)}
		</main>
	);
}
