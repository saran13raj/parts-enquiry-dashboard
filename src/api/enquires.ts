import axios from 'axios';

import type { Enquiry } from '#/types';

export const getEnquiriesAPI = async (): Promise<Enquiry[]> => {
	setTimeout(() => {}, Math.random() * 1500);
	const { data } = await axios.get<Enquiry[]>('/enquiries.json');
	return data;
};
