import axios from "axios";
//import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";


const Navbar = () => {
    //const [btnClicked,setBtnClicked]=useState(false);
    const user = useSelector((store)=>store.user);
    console.log(user)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async()=>{
        try{
            await axios.post(BASE_URL+"/logout",
                {},
                {withCredentials:true});
                dispatch(removeUser());
                return navigate("/login");
                //setBtnClicked(prev => !prev)
        }catch(err){
            console.log(err)
        }
    }
    return (
    <div>
        <div className="navbar bg-base-300">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl"> DevTinder</Link>
            </div>
    
                {user && (
                    <div className="flex-none gap-2">
                        <p className = "text-2xl text-white">Welcome {user?.firstName || ''}</p>
                        <div className="dropdown dropdown-end mx-5">
        
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
                
            <img
                alt="profile photo"
                src={user?.photoUrl || ''} />
            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li>
                                <Link to="/profile" className="justify-between">
                                    Profile
                                        <span className="badge">New</span>
                                </Link>
                            </li>
                                <li><Link to="/connections">Connections</Link></li>
                                <li><Link to="/request">Requests</Link></li>
                                <li><span onClick={()=>handleLogout()}>Logout</span></li>
                        </ul>
                    </div>
            </div>
        )}
    
    </div>
    {/* {
        btnClicked && (
            <div className="justify-itmes-center mt-20 items-center">
                <div className="card bg-neutral text-neutral-content w-96">
                    <div className="card-body items-center text-center">
                        
                            <p>Are you sure you want to logout.....</p>
                                <div className="card-actions justify-end mt-2">
                                    <button
                                    onClick={onLogout()} 
                                    className="btn btn-primary">yes</button>
                                    <button 
                                    onClick={()=>setBtnClicked(prev => !prev)}
                                    className="btn btn-primary">No</button>
                                </div>
                    </div>
                </div>
            </div>
        )
    } */}
    </div>
);
}

export default Navbar;
