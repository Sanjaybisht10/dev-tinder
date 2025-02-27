import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Premium = () => {

    const handleBuyClick = async(type)=>{
        try{
            const order = await axios.post(BASE_URL+"/payment/create",{
                membershipType:type,
            },{
                withCredentials:true,
            });
            const { amount, keyId, currency, notes, orderId } = order.data;

            const options = {
              key: keyId,
              amount,
              currency,
              name: "Dev Tinder",
              description: "Connect to other developers",
              order_id: orderId,
              prefill: {
                name: notes.firstName + " " + notes.lastName,
                email: notes.emailId,
                contact: "9999999999",
              },
              theme: {
                color: "#F37254",
              },
            //   handler: verifyPremiumUser,
            };
        
            const rzp = new window.Razorpay(options);
            rzp.open();
        }catch(err){
            console.log(err.message)
        }
        
    }
  return (
    <div className="m-20">
    <div className="flex w-full flex-col lg:flex-row">
    <div className="card bg-red-200 rounded-box grid h-80 flex-grow place-items-center">
        <h1 className="font-bold text-black text-2xl">Silver Membership</h1>
        <ul className="text-black text-2xl">
            <li> - Chat with other people</li>
            <li> - 100 connection Requests per day</li>
            <li> - Blue Tick</li>
            <li> - 3 months</li>
          </ul>
        <button 
        onClick={()=>handleBuyClick("Silver")}
        className="btn btn-outline btn-secondary">Buy Now</button>
    </div>
    <div className="divider lg:divider-horizontal">OR</div>
    <div className="card bg-lime-200 rounded-box grid h-80 flex-grow place-items-center">
    <h1 className="font-bold text-black text-2xl">Gold Membership</h1>
    <ul className="text-black text-2xl">
            <li> - Chat with other people</li>
            <li> - Inifiniye connection Requests per day</li>
            <li> - Blue Tick</li>
            <li> - 6 months</li>
          </ul>
    <button
    onClick={()=>handleBuyClick("Gold")}
     className="btn btn-outline btn-secondary">Buy Now</button>
    </div>
  </div>
    </div>
    
  );
}

export default Premium;
