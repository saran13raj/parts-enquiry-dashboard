import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
	component: About
});

function About() {
	return (
		<main className='page-wrap px-4 py-12'>
			<section className='island-shell rounded-2xl p-6 sm:p-8'>
				<div className='pointer-events-none absolute -top-24 -left-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]' />
				<div className='pointer-events-none absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]' />

				<p className='island-kicker mb-2'>About</p>
				<h1 className='display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl'>
					Roma Car Parts and Service
				</h1>
				<p className='m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]'>
					We connect garages, workshops, and individual customers with the right car
					parts — fast. Our platform streamlines every enquiry from first contact to
					final sale.
				</p>
			</section>
		</main>
	);
}
