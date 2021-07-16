import { UPDATE_TOKEN } from "../actions/user";

const initialState = {}

const reducer=(state=initialState,{type,payload})=>{
  switch (type){
    case UPDATE_TOKEN:
      return {
        ...initialState,
        token:payload
      }
    default:
      return state
  }
}
export default reducer
