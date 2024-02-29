import User from '../models/User.js';
import OverallStat from '../models/OverallStat.js';
import Transaction from '../models/Transaction.js';


export const getUser=async(req,res)=>{
    try {
        const {id}=req.param;
        const user= await User.findById(id);
        res.status(200).json(user);
    } 
    catch (error) {
        res.status(400).json({message:error.message})
    }
}

export const getDashboardStats=async(req,res)=>{
    try {
        //hardcoded values : we use make extra mock data
        const currentMonth="February";
        const currentYear=2024;
        const currentDay="2024-02-29";

        /*RECENT transactions */
        const transactions=await Transaction.find().limit(50).sort({createdOn:-1})

        /*Overall stats */
        const overallStats=await OverallStat.find({year:currentYear});

        const {
            totalCustomers,
            yearlyTotalSoldUnits,
            yearlySalesTotal,
            monthlyData,
            salesByCategory,
          } = overallStats[0];

          const thisMonthStats = overallStat[0].monthlyData.find(({ month }) => {
            return month === currentMonth;
          });
      
          const todayStats = overallStat[0].dailyData.find(({ date }) => {
            return date === currentDay;
          });

      res.status(200).json({
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
      thisMonthStats,
      todayStats,
      transactions,
    });
    } 
    catch (error) {
        res.status(400).json({message:error.message})
    }
}