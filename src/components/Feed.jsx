import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";


const Feed = () => {
  const feed = useSelector((store)=>store.feed);
  const dispatch = useDispatch();

  const getFeed = async()=>{
    try{
      if(feed) return;
      const res = await axios.get(BASE_URL + "/feed",{
        withCredentials:true,
      });
      dispatch(addFeed(res?.data))
    }catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    getFeed();
  },[]);

  if (!feed) return;

  if (feed.length <= 0){
    return <h1 className="flex justify-center my-10">No new users founds!</h1>;
  }
  return (
    <div>
      {
        feed && (
          <div className="flex justify-center my-10">
          <UserCard user={feed[0]}/>
          </div>
        )
      }
      
    </div>
  );
}

export default Feed;
