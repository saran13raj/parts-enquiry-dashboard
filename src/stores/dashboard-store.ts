import { create } from 'zustand';

import type { Enquiry, Pagination, StatusFilter } from '#/types';

interface DashboardStore {
	enquiries: Enquiry[];
	setEnquiries: (enquiries: Enquiry[]) => void;
	pagination: Pagination;
	setPagination: (patch: Partial<Pagination>) => void;
	selectedEnquiry: Enquiry | null;
	setSelectedEnquiry: (enquiry: Enquiry | null) => void;
	updateEnquiryStatus: (id: string, status: Enquiry['status']) => void;
	statusFilter: StatusFilter;
	setStatusFilter: (filter: StatusFilter) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
	enquiries: [],
	setEnquiries: (enquiries) => set({ enquiries }),
	pagination: {
		page: 1,
		pageSize: 10,
		total: 0
	},
	setPagination: (patch) =>
		set((s) => ({ pagination: { ...s.pagination, ...patch } })),
	selectedEnquiry: null,
	setSelectedEnquiry: (selectedEnquiry) => set({ selectedEnquiry }),
	// TODO: update status and store in local storage
	updateEnquiryStatus: (id, status) =>
		set((state) => {
			const updatedEnquiries = state.enquiries.map((e) =>
				e.id === id ? { ...e, status } : e
			);

			const updatedSelected =
				state.selectedEnquiry?.id === id
					? { ...state.selectedEnquiry, status }
					: state.selectedEnquiry;

			return {
				enquiries: updatedEnquiries,
				selectedEnquiry: updatedSelected
			};
		}),
	statusFilter: 'all',
	setStatusFilter: (statusFilter) => set({ statusFilter })
}));
