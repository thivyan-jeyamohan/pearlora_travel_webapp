import Hotel from '../models/Hotel';


export const getHotels= async(req,res)=>{

    const location=req.query();

    try{
        let query={};
        if(location){
            query.location=location;
        }

        const hotels= await Hotel.find(query);
        res.status(200).json(hotels);
    }catch{
        res.status(500).json({message:"Error fetching hotels.",error});
    }

}