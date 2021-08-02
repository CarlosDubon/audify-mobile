import { SET_SERVER_URI } from "../actions/config";

const initialState = {
  base:"http://147.182.171.70",
  subfolder:"/api",
  server:"http://147.182.171.70/api/v1",

}

const reducer =(state=initialState,{type,payload})=>{
  switch (type){
    case SET_SERVER_URI:
      return {
        base:payload,
        server:`${payload.base}${payload.folder}/v1`,
        subfolder:`${payload.folder}/socket.io`
      }
    default:
      return state
  }
}

export default reducer
