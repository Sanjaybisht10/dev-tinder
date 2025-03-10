import {io} from "socket.io-client" ;
import {BASE_URL} from "../utils/constants"

export const createSocketConection = ()=>{
    return io(BASE_URL);
}