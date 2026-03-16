import { useQuery } from '@tanstack/react-query';

import type { Enquiry } from '#/types';
import { getEnquiriesAPI } from '#/api/enquires';
import useDashboardStore from '#/stores/dashboard-store';

interface UseEnquiriesOptions {
	syncStore?: boolean;
}

const useEnquiries = (options?: UseEnquiriesOptions) => {
	// TODO: pass store as options?
	const setEnquiries = useDashboardStore((s) => s.setEnquiries);

	return useQuery<Enquiry[], Error>({
		queryKey: ['enquiries'],
		queryFn: async () => {
			const data = await getEnquiriesAPI();
			if (data?.length) {
				options?.syncStore && setEnquiries(data);
				return data;
			}
			return [];
		},
		staleTime: 1000 * 60 * 5 // 5 minutes
	});
};

export default useEnquiries;
