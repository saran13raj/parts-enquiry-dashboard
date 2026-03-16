import { format } from 'date-fns';
import { motion } from 'motion/react';
import {
	User,
	Mail,
	Building,
	Package,
	Calendar,
	Activity,
	PoundSterling,
	BarChart3
} from 'lucide-react';

import type { Enquiry, EnquiryStatus } from '#/types';

interface EnquiryDetailsProps {
	enquiry: Enquiry;
	onUpdateStatus: (id: string, status: EnquiryStatus) => void;
}

const DetailItem = ({
	icon,
	label,
	value
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
}) => (
	<div className='flex flex-col gap-1'>
		<div className='flex items-center gap-2'>
			<span className='text-[var(--lagoon-deep)]'>{icon}</span>
			<span className='island-kicker'>{label}</span>
		</div>
		<p className='m-0 text-base font-semibold text-[var(--sea-ink)]'>{value}</p>
	</div>
);

const getScoreColor = (score: number) => {
	if (score >= 80) return 'bg-emerald-500';
	if (score >= 50) return 'bg-amber-500';
	return 'bg-rose-500';
};

export const EnquiryDetails = ({
	enquiry,
	onUpdateStatus
}: EnquiryDetailsProps) => {
	return (
		<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
			<DetailItem
				icon={<User size={18} />}
				label='Customer Name'
				value={enquiry.customerName}
			/>
			<DetailItem
				icon={<Mail size={18} />}
				label='Email'
				value={enquiry.customerEmail}
			/>
			<DetailItem
				icon={<Building size={18} />}
				label='Company'
				value={enquiry.company}
			/>
			<DetailItem
				icon={<Package size={18} />}
				label='Part Requested'
				value={enquiry.partRequested}
			/>
			<DetailItem
				icon={<Calendar size={18} />}
				label='Date Submitted'
				value={format(new Date(enquiry.dateSubmitted), 'dd MMMM yyyy, HH:mm')}
			/>
			<DetailItem
				icon={<PoundSterling size={18} />}
				label='Deal Value'
				value={`£${enquiry.dealValue.toLocaleString()}`}
			/>

			<div className='md:col-span-2'>
				<div className='mb-2 flex items-center gap-2'>
					<BarChart3 size={18} className='text-[var(--lagoon-deep)]' />
					<span className='island-kicker'>Lead Score</span>
					<span className='ml-auto font-bold text-[var(--sea-ink)]'>
						{enquiry.score}%
					</span>
				</div>
				<div className='h-2.5 w-full overflow-hidden rounded-full bg-[var(--line)]'>
					<motion.div
						initial={{ width: 0 }}
						animate={{ width: `${enquiry.score}%` }}
						className={`h-full ${getScoreColor(enquiry.score)}`}
					/>
				</div>
			</div>

			<div className='md:col-span-2'>
				<div className='mb-2 flex items-center gap-2'>
					<Activity size={18} className='text-[var(--lagoon-deep)]' />
					<span className='island-kicker'>Status</span>
				</div>
				<select
					value={enquiry.status}
					onChange={(e) =>
						onUpdateStatus(enquiry.id, e.target.value as EnquiryStatus)
					}
					className='w-full cursor-pointer rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] px-3 py-2 text-sm text-[var(--sea-ink)] focus:border-[var(--lagoon-deep)] focus:outline-none'
				>
					<option value='new'>New</option>
					<option value='quoted'>Quoted</option>
					<option value='won'>Won</option>
					<option value='lost'>Lost</option>
				</select>
			</div>
		</div>
	);
};
