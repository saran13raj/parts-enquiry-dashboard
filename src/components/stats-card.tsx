import React from 'react';

export const StatsCard = ({
	icon,
	label,
	value
}: {
	icon: React.ReactNode;
	label: string;
	value: string | number;
}) => (
	<div className='island-shell flex items-center gap-3 rounded-xl px-4 py-3'>
		<span className='flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--chip-line)] bg-[var(--chip-bg)]'>
			{icon}
		</span>
		<div>
			<p className='island-kicker mb-0.5'>{label}</p>
			<p className='text-base leading-none font-bold text-[var(--sea-ink)]'>
				{value}
			</p>
		</div>
	</div>
);
