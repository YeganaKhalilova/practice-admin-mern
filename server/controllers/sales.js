import OverallStat from "../models/OverallStat.js";


export const getSales=async(req,res)=>{
    try {
        //this overallstats is an array
        const overallStats=await OverallStat.find();

        //so as it is an array, in the array, we are gonna render the 2021 stats only 
        
        res.status(200).json(overallStats[0])
    } catch (error) {
        res.status(400).json({message:error.message})

    }
}