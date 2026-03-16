import { useQuery } from '@tanstack/react-query';

import type { Enquiry } from '#/types';
import { getEnquiriesAPI } from '#/api/enquires';
import useEnquiriesStore from '#/stores/enquires-store';

interface UseEnquiriesOptions {
	syncStore?: boolean;
}

const useEnquiries = (options?: UseEnquiriesOptions) => {
	const setEnquiries = useEnquiriesStore((s) => s.setEnquiries);

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
