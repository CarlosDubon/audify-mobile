import { SET_SERVER_URI } from "../actions/config";

const initialState = {
  server:"http://147.182.171.70",
  socket:""
}

const reducer =(state=initialState,{type,payload})=>{
  switch (type){
    case SET_SERVER_URI:
      return {
        server:`${payload}/api/v1`,
        socket:`${payload}/api`
      }
    default:
      return state
  }
}

export default reducer
