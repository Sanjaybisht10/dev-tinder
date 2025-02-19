import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";

const Request = () => {
const request = useSelector((store)=>store.request);
const dispatch = useDispatch();

const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
        console.log(err)
    }
  };
    const fetchRequest = async()=>{
        try{
            const res = await axios.get(BASE_URL + "/user/requests/received",{
                withCredentials:true,
            });
            console.log("request data:",res.data?.data)
            dispatch(addRequest(res.data?.data))
        }catch(err){
            console.log(err)
        }
    };

    useEffect(()=>{
        fetchRequest();
    },[]);

    if(!request) return null;
    if (request.length === 0) return <h1> No Request Found</h1>;
  return (
    <div className="text-center my-10">
      <h1 className="text-bold text-white text-3xl">Connection Requests</h1>

      {request.map((request) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } =
          request.senderId;

        return (
          <div
            key={_id}
            className=" flex items-center m-4 p-8 rounded-lg bg-base-300 w-2/6 justify-between mx-auto mt-10"
          >
            <div>
              <img
                alt="photo"
                className="w-20 h-20 rounded-full"
                src={photoUrl}
              />
            </div>
            <div className="text-left mx-10 ">
              <h2 className="font-bold text-xl">
                {firstName + " " + lastName}
              </h2>
              {age && gender && <p>{age + ", " + gender}</p>}
              <p>{about}</p>
            </div>
            <div>
              <button
                className="btn btn-primary mx-2"
                onClick={() => reviewRequest("rejected", request._id)}
              >
                Reject
              </button>
              <button
                className="btn btn-secondary mx-2"
                onClick={() => reviewRequest("accepted", request._id)}
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Request;
