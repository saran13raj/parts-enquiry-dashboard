import { create } from 'zustand';

import type { Enquiry, Pagination } from '#/types';

interface DashboardStore {
	enquiries: Enquiry[];
	setEnquiries: (enquiries: Enquiry[]) => void;
	filteredEnquiries: Enquiry[];
	setFilteredEnquiries: (enquiries: Enquiry[]) => void;
	pagination: Pagination;
	setPagination: (patch: Partial<Pagination>) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
	enquiries: [],
	setEnquiries: (enquiries) => set({ enquiries }),
	filteredEnquiries: [],
	setFilteredEnquiries: (filteredEnquiries) => set({ filteredEnquiries }),
	pagination: {
		page: 1,
		pageSize: 10,
		total: 0
	},
	setPagination: (patch) =>
		set((s) => ({ pagination: { ...s.pagination, ...patch } }))
}));
