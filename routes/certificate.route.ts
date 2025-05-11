import express from "express";
import { isAuthenticated } from "../middleware/auth";
const certificateRouter = express.Router();
import { generateCertificate } from "../controllers/certificate.controller";

certificateRouter.post(
  "/generate-certificate",
  isAuthenticated,
  generateCertificate
);

export default certificateRouter;
