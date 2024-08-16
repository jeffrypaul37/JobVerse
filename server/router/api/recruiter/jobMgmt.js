// Import necessary modules
import { Router } from "express";
import * as controller from "../../../controllers/recruiterController.js";
import Auth from "../../../middleware/auth.js"; 
import verifyRoles from "../../../middleware/verifyRoles.js"; 
import ROLES_LIST from "../../../config/roles_list.js"; 

const router = Router();

// GET Methods
router
  .route("/getJobsForRecruiter")
  .get(Auth, controller.getJobsForRecruiter);

router
  .route("/getJobById/:id")
  .get(Auth, controller.getJobById);

router
  .route("/getApplicantsByJobId/:id")
  .get(Auth, controller.getApplicantsByJobId);

// POST Methods
router
  .route("/createJob")
  .post(Auth, controller.createJob);

router
  .route("/addApplicant")
  .post(Auth, controller.addApplicant);

// PUT Methods
router
  .route("/updateJob/:id")
  .put(Auth, controller.updateJob);

router
  .route("/updateApplicantStatus/:applicantId")
  .put(Auth, controller.updateApplicantStatus);

// DELETE Methods
router
  .route("/deleteJob/:id")
  .delete(Auth, controller.deleteJob);

export default router;
