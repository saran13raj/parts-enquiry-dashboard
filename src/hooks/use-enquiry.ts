import { useQuery } from '@tanstack/react-query';

import type { Enquiry } from '#/types';
import { getEnquiriesAPI } from '#/api/enquires';

const useEnquiries = () => {
	return useQuery<Enquiry[], Error>({
		queryKey: ['enquiries'],
		queryFn: getEnquiriesAPI,
		staleTime: 1000 * 60 * 5 // 5 minutes
	});
};

export default useEnquiries;
