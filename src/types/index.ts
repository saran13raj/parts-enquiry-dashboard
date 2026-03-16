export type EnquiryStatus = 'new' | 'pending' | 'resolved' | 'closed';

export interface Enquiry {
	id: string;
	customerName: string;
	customerEmail: string;
	company: string;
	partRequested: string;
	dateSubmitted: string; // ISO 8601 date string
	status: EnquiryStatus;
	dealValue: number;
	score: number;
}
