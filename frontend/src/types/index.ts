export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Sales User';
    token: string;
}

export interface Lead {
    _id: string;
    name: string;
    email: string;
    status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
    source: 'Website' | 'Instagram' | 'Referral';
    createdBy: {
        _id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedLeads {
    leads: Lead[];
    page: number;
    pages: number;
    total: number;
}
