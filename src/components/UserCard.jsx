import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { BASE_URL } from "../utils/constants";
import axios from "axios";


const UserCard = ({user}) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.log(err)
    }
  };
  return (
    <div className="card bg-base-300 w-96 shadow-xl">
    <figure>
      <img
        src={photoUrl}
        alt="profile photo" />
    </figure>
    <div className="card-body">
      <h2 className="card-title">{firstName + " " + lastName}</h2>
      {age && gender && <p>{age + ", " + gender}</p>}
      <p className="justify-center">{about}</p>
      <div className="card-actions justify-center my-2">
        <button  onClick={()=>handleSendRequest("ignored", _id)} className="btn btn-secondary">Ignore</button>
        <button onClick={()=>handleSendRequest("interested", _id)} className="btn btn-primary">Intrested</button>
      </div>
    </div>
  </div>
  );
}

export default UserCard;
