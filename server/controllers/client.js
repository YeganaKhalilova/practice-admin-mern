import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import getCountryIso3 from 'country-iso-2-to-3'

export const getProducts =async(req,res)=>{
    try {
       const products =await Product.find();

       /*
        with each product, mapping through, and making api 
        calls to the database to get stats of each product
        */
       
       const productsWithStats=await Promise.all(
        products.map(async(product)=>{
          const stat=await ProductStat.find({
            productId: product._id
          })
          return {
            ...product._doc,
            stat, 
          }
        })
       )
       res.status(200).json(productsWithStats);
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

export const getCustomers=async(req,res)=>{
  try {
    const customers=await User.find({role:"user"}).select("-password");
    res.status(200).json(customers);

  } catch (error) {
    res.status(400).json({message:error.message})

  }
}

export const  getTransactions=async(req,res)=>{
  try { 

    /*as we are doing server pagination, we need to get some values from query string 
    so we are grabbing them(values below: page etc) from front end, then front end sends these to req.query

    * a. sort should look like this: {"field":"userId", "sort":"desc"}
    */
    const { page, pageSize=1, sort=null, search="" }=req.query;

    /* b. Mongodb reads formatted sort which is : {userId:-1}
    but what we get looks like a */

    const generateSort=()=>{

      /*so front end sends  {"field":"userId", "sort":"desc"} as a string and then
      we will parse into json object by this method */

      const sortParsed=JSON.parse(sort);
      const sortFormatted={
        [sortParsed.field]:sortParsed.sort="asc" ? 1: -1 
      };
      return sortFormatted;
    }

    /*
    boolean used bc, we need to check if this sort exists or not...
    if yes generate it, if no render nothing */

    const sortFormatted=Boolean(sort)? generateSort() : {};
    
    const transactions=await Transaction.find({

        /**
         * gonna get the search (value of search is what users input) and assign it to the cost,
         * then check for the cost
         * we can search  for other fields, like userId as below, we cannot do it for all the fields tho:)
         * it would be just ... too much  I guess:/
         */
        $or:[
          {cost: {$regex : new RegExp(search, "i")}},
          {userId: {$regex : new RegExp(search, "i")}},
      ]
      })
      .sort(sortFormatted)
      .skip(page*pageSize)
      .limit(pageSize);


      const total=await Transaction.countDocuments({
        name:{$regex :search, $options: "i"}
      });

    res.status(200).json({
      transactions,
      total
    });

  } catch (error) {
    res.status(400).json({message:error.message})

  }
}

export const getGeography=async(req,res)=>{
  try {
    const users=await User.find();

    const mappedLocations=users.reduce((acc,{country})=>{
      const countryISO3=getCountryIso3(country);
      if(!acc[countryISO3]){
        acc[countryISO3]=0;
      }
      acc[countryISO3]++;
    return acc;
    });

    const formattedLocations= Object.entries(mappedLocations).map(
      ([country, count])=>{
        return {id:country,value:count}
      }
    )
    res.status(200).json(formattedLocations);

  } catch (error) {
    res.status(400).json({message:error.message})
  }
}