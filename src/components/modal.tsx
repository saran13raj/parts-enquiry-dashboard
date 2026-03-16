import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
	children: React.ReactNode;
	onClose: () => void;
	title: string;
}

export const Modal: React.FC<ModalProps> = ({ children, onClose, title }) => {
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handleEscape);
		return () => window.removeEventListener('keydown', handleEscape);
	}, [onClose]);

	return (
		<AnimatePresence>
			<div className='fixed inset-0 z-[100] flex items-center justify-center p-4'>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.1 }}
					onClick={onClose}
					className='absolute inset-0 bg-black/40 backdrop-blur-sm'
				/>
				<motion.div
					initial={{ opacity: 0, scale: 0.98 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.98 }}
					transition={{ duration: 0.1 }}
					className='island-shell relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl'
					onClick={(e) => e.stopPropagation()}
				>
					<div className='flex items-center justify-between border-b border-[var(--line)] bg-[var(--chip-bg)] px-6 py-4'>
						<h3 className='display-title m-0 text-xl font-bold text-[var(--sea-ink)]'>
							{title}
						</h3>
						<button
							onClick={onClose}
							className='rounded-full p-1.5 text-[var(--sea-ink-soft)] transition-colors hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]'
							aria-label='Close modal'
						>
							<X size={20} />
						</button>
					</div>
					<div className='max-h-[80vh] overflow-y-auto px-6 py-6'>{children}</div>
				</motion.div>
			</div>
		</AnimatePresence>
	);
};
