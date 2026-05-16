import { Request, Response } from 'express';
import Lead from '../models/Lead';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Create a lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, status, source } = req.body;

        const leadExists = await Lead.findOne({ email });
        if (leadExists) {
            return res.status(400).json({ message: 'Lead already exists with this email' });
        }

        const lead = new Lead({
            name,
            email,
            status,
            source,
            createdBy: req.user?._id,
        });

        const createdLead = await lead.save();
        res.status(201).json(createdLead);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all leads with filtering, searching, and pagination
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req: AuthRequest, res: Response) => {
    try {
        const { status, source, search, sort } = req.query;

        // Pagination
        const page = Number(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Filtering
        const query: any = {};
        
        // Non-admins can only see their own leads, or maybe everyone sees all? 
        // "Role-Based Access Control: Admin, Sales User". Let's assume Sales User can see all, or only their own.
        // Let's assume they can see all for now unless specified. Actually, typically Sales users see only their leads, Admins see all. Let's implement that.
        if (req.user?.role !== 'Admin') {
            query.createdBy = req.user?._id;
        }

        if (status) query.status = status;
        if (source) query.source = source;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        // Sorting
        let sortOption: any = { createdAt: -1 }; // Default: Latest
        if (sort === 'Oldest') {
            sortOption = { createdAt: 1 };
        }

        const leads = await Lead.find(query).sort(sortOption).skip(skip).limit(limit).populate('createdBy', 'name');
        const count = await Lead.countDocuments(query);

        res.json({
            leads,
            page,
            pages: Math.ceil(count / limit),
            total: count,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
export const getLeadById = async (req: AuthRequest, res: Response) => {
    try {
        const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');

        if (lead) {
            if (req.user?.role !== 'Admin' && (lead.createdBy as any)._id.toString() !== req.user?._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to view this lead' });
            }
            res.json(lead);
        } else {
            res.status(404).json({ message: 'Lead not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, status, source } = req.body;

        const lead = await Lead.findById(req.params.id);

        if (lead) {
            if (req.user?.role !== 'Admin' && lead.createdBy.toString() !== req.user?._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this lead' });
            }

            lead.name = name || lead.name;
            lead.email = email || lead.email;
            lead.status = status || lead.status;
            lead.source = source || lead.source;

            const updatedLead = await lead.save();
            res.json(updatedLead);
        } else {
            res.status(404).json({ message: 'Lead not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
export const deleteLead = async (req: AuthRequest, res: Response) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (lead) {
            if (req.user?.role !== 'Admin' && lead.createdBy.toString() !== req.user?._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to delete this lead' });
            }
            await lead.deleteOne();
            res.json({ message: 'Lead removed' });
        } else {
            res.status(404).json({ message: 'Lead not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Export leads to CSV
// @route   GET /api/leads/export
// @access  Private
export const exportLeads = async (req: AuthRequest, res: Response) => {
    try {
        const query: any = {};
        if (req.user?.role !== 'Admin') {
            query.createdBy = req.user?._id;
        }

        const leads = await Lead.find(query).populate('createdBy', 'name');

        if (!leads || leads.length === 0) {
            return res.status(404).json({ message: 'No leads found to export' });
        }

        const csvHeader = 'Name,Email,Status,Source,Created At\n';
        const csvRows = leads.map((lead: any) => {
            return `"${lead.name}","${lead.email}","${lead.status}","${lead.source}","${lead.createdAt}"`;
        }).join('\n');

        const csvData = csvHeader + csvRows;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
        res.status(200).send(csvData);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
