import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getEnquiriesAPI, searchEnquiriesAPI } from '#/api/enquires';
import { useDashboardStore } from '#/stores/dashboard-store';

interface UseEnquiriesOptions {
	syncStore?: boolean;
	pageSize?: number;
	page: number;
}

export const useEnquiries = (options?: UseEnquiriesOptions) => {
	const { pageSize = 10, page = 1, syncStore } = options || {};

	// TODO: pass store as options?
	const setEnquiries = useDashboardStore((s) => s.setEnquiries);
	const setPagination = useDashboardStore((s) => s.setPagination);

	const query = useQuery({
		queryKey: ['enquiries', page, pageSize],
		queryFn: () => getEnquiriesAPI({ page, pageSize }),
		staleTime: 1000 * 60 * 5, // 5 minutes,
		placeholderData: (prev) => prev // keeps previous page data visible while fetching
	});

	const { data: result } = query;

	// TODO: can this be done without useEffect?
	useEffect(() => {
		if (result && syncStore) {
			setEnquiries(result.data);
			setPagination({ total: result.total });
		}
	}, [result, syncStore, setEnquiries, setPagination]);

	return query;
};

export const useEnquiriesSearch = (options: {
	search: string;
	page: number;
	pageSize: number;
	syncStore?: boolean;
}) => {
	const { search, page, pageSize, syncStore } = options;

	// TODO: pass store as options?
	const setEnquiries = useDashboardStore((s) => s.setEnquiries);
	const setPagination = useDashboardStore((s) => s.setPagination);

	const query = useQuery({
		queryKey: ['enquiries', 'search', search, page, pageSize],
		queryFn: () => searchEnquiriesAPI({ search, page, pageSize }),
		staleTime: 1000 * 60 * 5,
		placeholderData: (prev) => prev
	});

	const { data: result } = query;

	useEffect(() => {
		if (result && syncStore) {
			setEnquiries(result.data);
			setPagination({ total: result.total });
		}
	}, [result, syncStore, setEnquiries, setPagination]);

	return query;
};
