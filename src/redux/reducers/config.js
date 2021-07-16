import { SET_SERVER_URI } from "../actions/config";

const initialState = {
  server:"",
  socket:""
}

const reducer =(state=initialState,{type,payload})=>{
  switch (type){
    case SET_SERVER_URI:
      return {
        server:`${payload}/api`,
        socket:`${payload}`
      }
    default:
      return state
  }
}

export default reducer
