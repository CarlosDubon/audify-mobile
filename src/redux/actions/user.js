export const UPDATE_TOKEN = "UPDATE_TOKEN"

export const updateToken=(token="")=>{
  return{
    type:UPDATE_TOKEN,
    payload:token
  }
}
