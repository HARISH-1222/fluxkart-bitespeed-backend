import express from "express";

const Router:express.Router = express.Router();

import * as contactController from '../controllers/controller.contact'

Router.route("/identify").post(contactController.getContactList);

export default Router;