export const SET_SERVER_URI = "SET_SERVER_URI"
export const SET_FOLLOW = "SET_FOLLOW"

export const setServerURI =(uri)=>({
  type:SET_SERVER_URI,
  payload:uri
})

export const setFollowUser=(data)=>({
  type:SET_FOLLOW,
  payload:data
})
