import { useState, useMemo, useEffect } from 'react';
import {
	ChevronUp,
	ChevronDown,
	ChevronsUpDown,
	ChevronLeft,
	ChevronRight
} from 'lucide-react';

export type ColumnDef<T> = {
	key: keyof T;
	label: string;
	sortable?: boolean;
	render?: (value: unknown, row: T) => React.ReactNode;
};

type SortDir = 'asc' | 'desc' | null;

export interface PaginationProps {
	page: number;
	pageSize: 10 | 15 | 20;
	total: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: 10 | 15 | 20) => void;
}

interface TableProps<T extends object> {
	data: T[];
	columns: ColumnDef<T>[];
	filterPlaceholder?: string;
	filterKeys?: (keyof T)[];
	onFilteredDataChange?: (filtered: T[]) => void;
	pagination?: PaginationProps;
	onRowClick?: (row: T) => void;
}

const PAGE_SIZE_OPTIONS: Array<10 | 15 | 20> = [10, 15, 20];

function Table<T extends object>({
	data,
	columns,
	filterPlaceholder = 'Filter...',
	filterKeys,
	onFilteredDataChange,
	pagination,
	onRowClick
}: TableProps<T>) {
	const [sortKey, setSortKey] = useState<keyof T | null>(null);
	const [sortDir, setSortDir] = useState<SortDir>(null);
	const [filter, setFilter] = useState('');

	const handleSort = (key: keyof T) => {
		if (sortKey !== key) {
			setSortKey(key);
			setSortDir('asc');
		} else if (sortDir === 'asc') {
			setSortDir('desc');
		} else {
			setSortKey(null);
			setSortDir(null);
		}
	};

	const searchableKeys = filterKeys ?? columns.map((c) => c.key);

	const processed = useMemo(() => {
		let rows = [...data];

		if (filter.trim()) {
			const q = filter.toLowerCase();
			rows = rows.filter((row) =>
				searchableKeys.some((k) =>
					String(row[k] ?? '')
						.toLowerCase()
						.includes(q)
				)
			);
		}

		if (sortKey && sortDir) {
			rows.sort((a, b) => {
				const av = a[sortKey];
				const bv = b[sortKey];
				const cmp =
					typeof av === 'number' && typeof bv === 'number'
						? av - bv
						: String(av).localeCompare(String(bv));
				return sortDir === 'asc' ? cmp : -cmp;
			});
		}

		return rows;
	}, [data, filter, sortKey, sortDir]);

	useEffect(() => {
		onFilteredDataChange?.(processed);
	}, [processed]);

	const SortIcon = ({ col }: { col: ColumnDef<T> }) => {
		if (!col.sortable) return null;
		if (sortKey !== col.key)
			return <ChevronsUpDown size={13} className='opacity-40' />;
		if (sortDir === 'asc')
			return <ChevronUp size={13} className='text-[var(--lagoon-deep)]' />;
		return <ChevronDown size={13} className='text-[var(--lagoon-deep)]' />;
	};

	// Pagination derived values
	const totalPages = pagination
		? Math.max(1, Math.ceil(pagination.total / pagination.pageSize))
		: null;

	const rangeStart = pagination
		? (pagination.page - 1) * pagination.pageSize + 1
		: null;
	const rangeEnd = pagination
		? Math.min(pagination.page * pagination.pageSize, pagination.total)
		: null;

	return (
		<div className='island-shell overflow-hidden rounded-2xl'>
			{/* Filter bar */}
			<div className='border-b border-[var(--line)] px-4 py-3'>
				<input
					type='text'
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					placeholder={filterPlaceholder}
					className='w-full rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm text-[var(--sea-ink)] transition-colors duration-150 placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon-deep)] focus:outline-none sm:w-72'
				/>
			</div>

			{/* Table */}
			<div className='overflow-x-auto'>
				<table className='w-full text-left text-sm'>
					<thead>
						<tr className='border-b border-[var(--line)] bg-[var(--chip-bg)]'>
							{columns.map((col) => (
								<th
									key={String(col.key)}
									onClick={() => col.sortable && handleSort(col.key)}
									className={`island-kicker px-4 py-3 font-semibold tracking-wide whitespace-nowrap text-[var(--sea-ink-soft)] ${
										col.sortable
											? 'cursor-pointer transition-colors select-none hover:text-[var(--sea-ink)]'
											: ''
									}`}
								>
									<span className='inline-flex items-center gap-1.5'>
										{col.label}
										<SortIcon col={col} />
									</span>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{processed.length === 0 ? (
							<tr>
								<td
									colSpan={columns.length}
									className='px-4 py-10 text-center text-[var(--sea-ink-soft)]'
								>
									No results found
								</td>
							</tr>
						) : (
							processed.map((row, i) => (
								<tr
									key={i}
									onClick={() => onRowClick?.(row)}
									className={`border-b border-[var(--line)] transition-colors duration-150 last:border-0 hover:bg-[var(--link-bg-hover)] ${onRowClick ? 'cursor-pointer' : ''}`}
								>
									{columns.map((col) => (
										<td
											key={String(col.key)}
											className='px-4 py-3 whitespace-nowrap text-[var(--sea-ink)]'
										>
											{col.render
												? col.render(row[col.key], row)
												: String(row[col.key] ?? '—')}
										</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Footer — row count + pagination */}
			<div className='flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] px-4 py-2'>
				{/* Left: row range */}
				<p className='m-0 text-xs text-[var(--sea-ink-soft)]'>
					{pagination
						? `${rangeStart}–${rangeEnd} of ${pagination.total} rows`
						: `${processed.length} of ${data.length} rows`}
				</p>

				{/* Right: pagination controls */}
				{pagination && totalPages !== null && (
					<div className='flex items-center gap-2'>
						{/* Page size picker */}
						<select
							value={pagination.pageSize}
							onChange={(e) =>
								pagination.onPageSizeChange(Number(e.target.value) as 10 | 15 | 20)
							}
							className='rounded-lg border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2 py-1 text-xs text-[var(--sea-ink)] focus:border-[var(--lagoon-deep)] focus:outline-none'
						>
							{PAGE_SIZE_OPTIONS.map((s) => (
								<option key={s} value={s}>
									{s} / page
								</option>
							))}
						</select>

						{/* Prev */}
						<button
							type='button'
							disabled={pagination.page <= 1}
							onClick={() => pagination.onPageChange(pagination.page - 1)}
							className='flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-[var(--chip-line)] bg-[var(--chip-bg)] text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)] disabled:cursor-not-allowed disabled:opacity-35'
							aria-label='Previous page'
						>
							<ChevronLeft size={14} />
						</button>

						{/* Page indicator */}
						<span className='island-kicker min-w-[4rem] text-center'>
							{pagination.page} / {totalPages}
						</span>

						{/* Next */}
						<button
							type='button'
							disabled={pagination.page >= totalPages}
							onClick={() => pagination.onPageChange(pagination.page + 1)}
							className='flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-[var(--chip-line)] bg-[var(--chip-bg)] text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)] disabled:cursor-not-allowed disabled:opacity-35'
							aria-label='Next page'
						>
							<ChevronRight size={14} />
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default Table;
