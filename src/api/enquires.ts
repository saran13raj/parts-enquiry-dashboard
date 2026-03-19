import axios from 'axios';

import type { Enquiry } from '#/types';

export const getEnquiriesAPI = async ({
	page,
	pageSize
}: {
	page: number;
	pageSize: number;
}): Promise<{
	data: Enquiry[];
	total: number;
}> => {
	await new Promise((resolve) => setTimeout(resolve, Math.random() * 700));
	const { data: all } = await axios.get<Enquiry[]>('/enquiries.json');
	const total = all.length;
	const start = (page - 1) * pageSize;
	const end = start + pageSize;
	const data = all.slice(start, end);
	return { data, total };
};

export const searchEnquiriesAPI = async ({
	search,
	page,
	pageSize
}: {
	search: string;
	page: number;
	pageSize: number;
}): Promise<{
	data: Enquiry[];
	total: number;
}> => {
	await new Promise((resolve) => setTimeout(resolve, Math.random() * 500));
	const { data: all } = await axios.get<Enquiry[]>('/enquiries.json');

	let filtered = all;
	if (search.trim()) {
		const q = search.toLowerCase();
		filtered = all.filter(
			(e) =>
				e.customerName.toLowerCase().includes(q) ||
				e.partRequested.toLowerCase().includes(q)
		);
	}

	const total = filtered.length;
	const start = (page - 1) * pageSize;
	const end = start + pageSize;
	const data = filtered.slice(start, end);
	return { data, total };
};
