import express from "express";

const Router:express.Router = express.Router();

Router.route("/identify").post();

export default Router;