import { create } from 'zustand';

import type { Enquiry } from '#/types';

interface EnquiriesStore {
	enquiries: Enquiry[];
	setEnquiries: (enquiries: Enquiry[]) => void;
}

const useEnquiriesStore = create<EnquiriesStore>((set) => ({
	enquiries: [],
	setEnquiries: (enquiries) => set({ enquiries })
}));

export default useEnquiriesStore;
