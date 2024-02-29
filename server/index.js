import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import morgan from 'morgan'
import clientRoutes from './routes/client.js'
import generalRoutes from './routes/general.js'
import managementRoutes from './routes/management.js'
import salesRoutes from './routes/sales.js'

dotenv.config();

const PORT=process.env.PORT||5001;
const MONGO_DB_URL=process.env.MONGO_URL || "mongodb://127.0.0.1:27017/Admin Dashboard"
/* Middlewares */

dotenv.config();
const app=express();
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(express.json());
app.use(morgan("common"));
app.use(bodyParser.json)
app.use(bodyParser.urlencoded({extended:false}))


/* data imports */
import User from './models/User.js'
import {dataUser, dataProduct, dataProductStat, dataTransaction, dataOverallStat,dataAffiliateStat} from './data/index.js'
import Product from './models/Product.js'
import ProductStat from './models/ProductStat.js'
import Transaction from './models/Transaction.js'
import OverallStat from './models/OverallStat.js'
import AffiliateStat from './models/AffiliateStat.js'
/* Routes */
app.use('/client', clientRoutes);
app.use("/general", generalRoutes);
app.use("/management",managementRoutes);
app.use('/sales', salesRoutes);


/* Mongoose  */
mongoose.connect(MONGO_DB_URL ,{
}).then(
    ()=>{
        app.listen(PORT,()=>console.log(`Server running on port  ${PORT}`));  
        /* ONLY ADD DATA ONE TIME
        I commented them out after invoking them one time*/
        // Product.insertMany(dataProduct);
        // ProductStat.insertMany(dataProductStat)
        // User.insertMany(dataUser);
        // Transaction.insertMany(dataTransaction);
        // OverallStat.insertMany(dataOverallStat);
        // AffiliateStat.insertMany(dataAffiliateStat);
        
    }).catch((error)=>
    console.log(`Could not connect. ${error} occured`))