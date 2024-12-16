//import frameworks
import express from 'express';
import cors from 'cors';
//import modules
import config from './config.js';
import productRoute from './Routes/productRoute.js';
import loginRoute from './Routes/loginRoute.js';
import userRoute from './Routes/userRoute.js';
import schemaValidator from './Middleware/schemaValidator.js';
//express init
const app = express();
app.use(express.json());
//cors init
app.use(cors({
  //origin set to '*' for dev only
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

//use routes
app.use('/api/users', schemaValidator("/Routes/loginRoute.js"), loginRoute);
app.use('/api/users', schemaValidator("/Routes/userRoute.js"), userRoute);
app.use('/api/products', schemaValidator("/Routes/productRoute.js"), productRoute);
app.use('/api/productsAll', schemaValidator("/Routes/productRoute.js"), productRoute);


app.listen(config.port, () =>
  console.log(`Server is live @ ${config.hostUrl}`),
);