/* Author: Bhishman Desai */
import {Router} from "express";
import {testController} from "../../controllers/testController.js";

const router = Router();

router.route("/").get(testController);

export default router;