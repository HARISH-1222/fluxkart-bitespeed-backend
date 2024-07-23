import express,{Express} from "express";
import customerRoute from "./src/routers/router.customer";

const app:Express = express();

app.use(express.json({limit:"100kb"}))

app.use('/api/v1/customer',customerRoute);


export default app;