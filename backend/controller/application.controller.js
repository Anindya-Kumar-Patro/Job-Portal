import { Application } from '../models/application.model.js'
import { Job } from '../models/jobs.model.js';

export const applyJob = async (req, res) => {
    try {
        const userID = req.id;
        const jobID = req.params.id;
        console.log(userID, jobID)
        if (!jobID) {
            return res.status(400).json({
                message: "Job ID is required",
                success: false
            })
        }
        const existingApplicatant = await Application.findOne({job: jobID, applicant: userID});
        if (existingApplicatant) {
            return res.status(400).json({
                message: "Applicant has already applied for this job",
                success: false
            })
        }
        const job = await Job.findById(jobID);
        if (!job) {
            return res.status(400).json({
                message: "Job not found",
                success: false
            })
        }
        const ApplyJob = await Application.create({
            job: jobID,
            applicant: userID
        });
        if (!ApplyJob) {
            return res.status(400).json({
                message: "Unable to apply",
                success: false
            })
        }
        job.application.push(ApplyJob._id);
        await job.save()
        return res.status(200).json({
            message: "Job Applied Successfully",
            ApplyJob,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const getAppliedJobs = async (req, res) => {
    try {
        const userID = req.id;
        const Applications = await Application.find({applicant: userID}).sort({createdAt: -1}).populate({
            path: 'job',
            options: {sort:{createdAt: -1}},
            populate: {
                path: 'company',
                options: {sort:{createdAt: -1}}
            }
        })
        if (!Applications) {
            return res.status(404).json({
                message: "No Applications found",
                success: false
            })
        }
        return res.status(200).json({
            message: "Applications Found",
            Applications,
            success: false
        })
    } catch (error) {
        console.log(error)
    }
}

export const getApplicants = async (req, res) => {
    try {
        const jobID = req.params.id;
        const job = await Job.findById(jobID).populate({
            path: 'application',
            option: {sort:{createdAt: -1}},
            populate:{
                path: 'applicant'
            }
        })
        if (!job) {
            return res.status(404).json({
                message: "No Applicants found for this job",
                success: false
            })
        }
        return res.status(200).json({
            message: "Applicants found for this job",
            job,
            success: false
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateStatus = async (req, res) => {
    try {
        const {status} = req.body;
        const applicationID = req.params.id;
        if (!status) {
            return res.status(400).json({
                message: "Status is missing",
                success: false
            })
        }
        const application = await Application.findOne({_id: applicationID});
        if (!application) {
            return res.status(404).json({
                message: "Application does not exists",
                success: false
            })
        }
        application.status = status.toLowerCase();
        await application.save()

        return res.status(200).json({
            message: "application updated",
            application,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}