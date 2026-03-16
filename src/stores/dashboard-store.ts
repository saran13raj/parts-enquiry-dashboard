import { create } from 'zustand';

import type { Enquiry } from '#/types';

interface DashboardStore {
	enquiries: Enquiry[];
	setEnquiries: (enquiries: Enquiry[]) => void;
	filteredEnquiries: Enquiry[];
	setFilteredEnquiries: (enquiries: Enquiry[]) => void;
}

const useDashboardStore = create<DashboardStore>((set) => ({
	enquiries: [],
	setEnquiries: (enquiries) => set({ enquiries }),
	filteredEnquiries: [],
	setFilteredEnquiries: (filteredEnquiries) => set({ filteredEnquiries })
}));

export default useDashboardStore;
