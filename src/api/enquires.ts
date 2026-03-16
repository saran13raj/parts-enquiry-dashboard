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
	await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
	const { data: all } = await axios.get<Enquiry[]>('/enquiries.json');
	const total = all.length;
	const start = (page - 1) * pageSize;
	const end = start + pageSize;
	const data = all.slice(start, end);
	return { data, total };
};
