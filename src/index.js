import express from "express";
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import centralizedRoutes from './routes/index.js'
import { STATUS_CODES } from "./constants/statusCodeConstants.js";
import { APP_CONSTANTS } from './constants/appConstants.js';

const app = express();

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());

app.use("/backend/rfi", centralizedRoutes);

app.use(express.json());

app.get('/backend/rfi', (req, res) => {
  res.status(STATUS_CODES.OK).send({
    message: `Welcome to RFI-Service Datalake 3.0 ${APP_CONSTANTS.APP_NAME} v${APP_CONSTANTS.VERSION}`,
  });
});

const PORT =  process.env.PORT || 3007;

app.listen(PORT, () => {
  console.log(`server started on PORT ${PORT}`);
});



