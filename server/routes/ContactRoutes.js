import { Router } from "express";
import {
  getAllContacts,
  getContactForDMList,
  searchContact,
} from "../controllers/ContactController.js";
import { verifyToken } from "../middlewares/Authmiddleware.js";

const ContactRoutes = Router();

ContactRoutes.post("/search", verifyToken, searchContact);
ContactRoutes.get("/getContactForDMList", verifyToken, getContactForDMList);
ContactRoutes.get("/get-all-contacts", verifyToken, getAllContacts);
export default ContactRoutes;
