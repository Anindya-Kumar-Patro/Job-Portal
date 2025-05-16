import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getAdminJob, getAllJobs, getJobById, postJob } from '../controller/job.controller.js';

const router = express.Router()

router.route("/create").post(isAuthenticated, postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.route("/adminjobs").get(isAuthenticated, getAdminJob);

export default router;