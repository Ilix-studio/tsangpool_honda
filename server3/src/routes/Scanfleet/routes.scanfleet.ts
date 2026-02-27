import express from "express";
import { protect, authorize } from "../../middleware/authmiddleware";
import {
  getScanFleetProfile,
  activateScanFleetToken,
} from "../../controllers/Scanfleet/scanfleet.controller";

const router = express.Router();

router.get("/profile", protect, getScanFleetProfile);
router.post("/activate", protect, activateScanFleetToken);

export default router;
