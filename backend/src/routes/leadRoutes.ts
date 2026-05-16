import express from 'express';
import {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead,
    exportLeads,
} from '../controllers/leadController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, createLead).get(protect, getLeads);
router.route('/export').get(protect, exportLeads);
router.route('/:id').get(protect, getLeadById).put(protect, updateLead).delete(protect, deleteLead);

export default router;
