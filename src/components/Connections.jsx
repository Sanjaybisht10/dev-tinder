import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { addConnection } from "../utils/connectionSlice";
import { useDispatch, useSelector } from "react-redux";

const Connections = () => {
  const connectionUser = useSelector((store)=>store.connection);
  const dispatch = useDispatch();

  const getConnections = async()=>{
    try{
      const res = await axios.get(BASE_URL + "/user/connections",{
        withCredentials:true,
      });
      dispatch(addConnection(res?.data?.data))
      console.log("connection data",res.data?.data);
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{
    getConnections();
  },[]);

  if(!connectionUser) return null;
  if (connectionUser.length === 0) return <h1> No Connections Found</h1>;
  return (
    <div className="text-center my-10">
      
      <h1 className="text-4xl text-bold text-white">Connections</h1>
      
      {
        
        connectionUser.map((user)=>{
          const {_id,firstName,lastName,photoUrl,age,about,gender} = user;
          return(
            <div
            key={_id}
            className="flex m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto"
          >
            <div>
              <img
                alt="photo"
                className="w-20 h-20 rounded-full object-cover"
                src={photoUrl}
              />
            </div>
            <div className="text-left mx-4 ">
              <h2 className="font-bold text-xl">
                {firstName + " " + lastName}
              </h2>
              {age && gender && <p>{age + ", " + gender}</p>}
              <p>{about}</p>
            </div>
            {/* <Link to={"/chat/" + _id}>
              <button className="btn btn-primary">Chat</button>
            </Link> */}
          </div>
          )
        })
      }
    </div>
  );
}

export default Connections;
