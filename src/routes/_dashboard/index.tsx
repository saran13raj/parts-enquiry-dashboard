import { useMemo, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';

import type { Enquiry, StatusFilter } from '#/types';
import type { ColumnDef, PaginationProps } from '#/components/table';
import { useEnquiriesSearch } from '#/hooks/use-enquiry';
import { Spinner } from '#/components/spinner';
import Table from '#/components/table';
import { useDashboardStore } from '#/stores/dashboard-store';
import { ClipboardList, Star, TrendingUp } from 'lucide-react';
import { StatsCard } from '#/components/stats-card';
import { Modal } from '#/components/modal';
import { EnquiryDetails } from './enquiry-details';
import { cn } from '#/utils';
import { useDebounce } from '#/hooks/use-debounce';

export const Route = createFileRoute('/_dashboard/')({ component: Dashboard });

const columns: ColumnDef<Enquiry>[] = [
	{ key: 'id', label: 'ID' },
	{ key: 'customerName', label: 'Customer', sortable: true },
	{ key: 'partRequested', label: 'Part', sortable: true },
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

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
	{ label: 'All', value: 'all' },
	{ label: 'New', value: 'new' },
	{ label: 'Quoted', value: 'quoted' },
	{ label: 'Won', value: 'won' },
	{ label: 'Lost', value: 'lost' }
];

const StatusFilterBar = ({
	value,
	onChange
}: {
	value: StatusFilter;
	onChange: (v: StatusFilter) => void;
}) => (
	<div className='mb-3 flex flex-wrap gap-2'>
		{STATUS_OPTIONS.map((opt) => (
			// move this to a button variant component
			<button
				key={opt.value}
				type='button'
				onClick={() => onChange(opt.value)}
				className={cn(
					'cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
					value === opt.value
						? 'border-[var(--lagoon-deep)] bg-[var(--lagoon-deep)]/30 text-white'
						: 'border-[var(--chip-line)] bg-[var(--chip-bg)] text-[var(--sea-ink-soft)] hover:border-[var(--lagoon-deep)] hover:text-[var(--sea-ink)]'
				)}
			>
				{opt.label}
			</button>
		))}
	</div>
);

// TODO: Make this a component if used in other places too
const SummaryStats = ({
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
		<div className='mb-4 grid grid-cols-1 gap-3 md:grid-cols-3'>
			{stats.map((stat) => (
				<StatsCard key={stat.label} {...stat} />
			))}
		</div>
	);
};

function Dashboard() {
	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search, 200);

	const enquiries = useDashboardStore((s) => s.enquiries);
	const pagination = useDashboardStore((s) => s.pagination);
	const setPagination = useDashboardStore((s) => s.setPagination);
	const selectedEnquiry = useDashboardStore((s) => s.selectedEnquiry);
	const setSelectedEnquiry = useDashboardStore((s) => s.setSelectedEnquiry);
	const updateEnquiryStatus = useDashboardStore((s) => s.updateEnquiryStatus);
	const statusFilter = useDashboardStore((s) => s.statusFilter);
	const setStatusFilter = useDashboardStore((s) => s.setStatusFilter);

	const { isLoading, isError } = useEnquiriesSearch({
		search: debouncedSearch,
		syncStore: true,
		pageSize: pagination.pageSize,
		page: pagination.page
	});

	const paginationProps: PaginationProps = {
		page: pagination.page,
		pageSize: pagination.pageSize,
		total: pagination.total,
		onPageChange: (page) => setPagination({ page }),
		onPageSizeChange: (pageSize) => setPagination({ page: 1, pageSize })
	};

	const displayedEnquiries = useMemo(() => {
		if (!Array.isArray(enquiries)) return [];
		let rows =
			statusFilter === 'all'
				? enquiries
				: enquiries.filter((e) => e.status === statusFilter);

		return rows;
	}, [enquiries, statusFilter]);

	const handleSearchChange = (value: string) => {
		setSearch(value);
		setPagination({ page: 1 });
	};

	return (
		<main className='p-4'>
			{isLoading ? (
				<Spinner className='mx-auto mt-12' />
			) : isError ? (
				<span className='mt-12 flex items-center justify-center text-sm font-semibold text-[var(--sea-ink-soft)]'>
					Failed to load enquiries. Please try again.
				</span>
			) : (
				<>
					<SummaryStats
						filtered={displayedEnquiries ?? []}
						total={pagination.total}
					/>
					<div className='flex flex-col gap-3 md:flex-row'>
						<p className='font-semibold'>Filter Status</p>
						<StatusFilterBar value={statusFilter} onChange={setStatusFilter} />
					</div>
					<Table
						data={displayedEnquiries}
						columns={columns}
						filterPlaceholder='Search by customer name or part'
						// NOTE: filter logic should happen via api call
						pagination={paginationProps}
						onRowClick={(row) => setSelectedEnquiry(row)}
						search={search}
						onSearchChange={handleSearchChange}
					/>
				</>
			)}

			{selectedEnquiry && (
				<Modal title='Enquiry Details' onClose={() => setSelectedEnquiry(null)}>
					<EnquiryDetails
						enquiry={selectedEnquiry}
						onUpdateStatus={updateEnquiryStatus}
					/>
				</Modal>
			)}
		</main>
	);
}
