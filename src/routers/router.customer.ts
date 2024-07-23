import express from "express";

const Router:express.Router = express.Router();

import * as contactController from '../controllers/controller.contact'

Router.route("/identify").post(contactController.getContactList);

//For Testing
Router.route("/insert").post(contactController.insertController);

Router.route("/delete").delete(contactController.deleteController);

export default Router;