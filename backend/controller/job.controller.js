import { Job } from "../models/jobs.model.js";

export const postJob = async (req, res) => {
    try {
        const {title, description, requirements, salary, 
            experienceLevel, location, jobType, position, companyId} = req.body;
        const userId = req.id    
        if (!title || !description || !requirements || !salary || !experienceLevel || !location || !jobType || !position || !companyId) {
            console.log(title, description, requirements, salary, 
                experienceLevel, location, jobType, position, companyId)
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }    
        const job = await Job.create({
            title, 
            description, 
            requirements: requirements.split(','), 
            salary: Number(salary), 
            experienceLevel, 
            location, 
            jobType, 
            position, 
            company: companyId,
            createdBy: userId
        })
        if(!job) {
            return res.status(400).json({
                message: "Couldn't create Job",
                success: false
            })
        }
        return res.status(200).json({
            message: "Job Successfully created",
            job,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or:[
                {title: {$regex:keyword, $options:"i"}},
                {description: {$regex:keyword, $options:"i"}}
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({createdAt: -1});
        if (!jobs || jobs.length == 0) {
            return res.status(404).json({
                message:"Jobs with this title not found",
                success: false
            })
        }
        return res.status(200).json({
            message:"Jobs found",
            jobs,
            success: false
        })
    } catch (error) {
        console.log(error)
    }
}

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        return res.status(404).json({
            message: "Job found",
            job,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const getAdminJob = async (req, res) => {
    try {
        const adminID = req.id;
        const adminJobs = await Job.find({createdBy: adminID})
        if (!adminJobs) {
            return res.status(404).json({
                message: "No jobs could be found",
                success: false
            })
        }
        return res.status(200).json({
            message: "Jobs with admin found",
            adminJobs,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}