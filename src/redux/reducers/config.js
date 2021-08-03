import { SET_FOLLOW, SET_SERVER_URI } from "../actions/config";

const initialState = {
  base:"http://147.182.171.70",
  subfolder:"/api",
  server:"http://147.182.171.70/api/v1",
  socket:"/api/socket.io",
  followUser:true
}

const reducer =(state=initialState,{type,payload})=>{
  switch (type){
    case SET_SERVER_URI:
      return {
        base:payload.base,
        server:`${payload.base}${payload.folder}/v1`,
        subfolder:`${payload.folder}`,
        socket:`${payload.folder}/socket.io`,
        followUser: state.followUser
      }
    case SET_FOLLOW:
      return {
        ...state,
        followUser: payload
      }
    default:
      return state
  }
}

export default reducer;
