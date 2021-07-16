import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import LootieView from 'lottie-react-native'
import { Text, Title } from "react-native-paper";
import io from "socket.io-client"
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { SERVER_URI } from "../theme/ServerConection";
import { connect } from "react-redux";
const InitConnection = (props) => {
  const navigation = useNavigation()
  const [dots,setDots]=useState(".")
  const [word,setWord]=useState(0)

  const words = ["Obteniendo usuario","Estableciendo una conexión","Preparando audifonos"]
  useEffect(()=>{
    const timerDots = setTimeout(()=>{
      if(dots.length < 3){
        setDots(dots+".")
      }else{
        setDots(".")
      }
    },1000)

    return ()=>{
      clearTimeout(timerDots)
    }
  },[dots,word])

  useEffect(()=>{
    const wordsTimer=setTimeout(()=>{
      setWord( Math.floor(Math.random() * 2))
    },3000)

    return ()=> {
      clearTimeout(wordsTimer)
    }
  },[word])

  useEffect(()=>{
    verifyAccess()
    /*const accessTimer=setTimeout(()=>{
      verifyAccess()
    },1000*60*2)
    return()=>{
      clearTimeout(accessTimer)
    }*/
  },[])

  const verifyAccess= async ()=>{
    try{
      let res =await axios.get(`${props.server}/output/ask`,{
        headers:{
          Authorization:`Bearer ${props.token}`
        }
      })
      if(res.status===200){
        navigation.navigate("MapPage")
      }
    }catch (e) {
      console.log(e)

    }
  }

  return (
    <View style={Style.container}>
      <View>
        <LootieView
          style={Style.animation}
          source={require("../theme/animation/sound.json")}
          autoPlay
          loop
        />
      </View>
      <View style={{flex:1}}>
        <Text style={Style.mainText}>{`${words[word]} ${dots}`}</Text>
      </View>
    </View>
  );
};

const Style = StyleSheet.create({
  container:{
    flex:1,
    alignItems:"center",
    justifyContent:"center"
  },
  animation:{
    width: Dimensions.get("window").width
  },
  mainText:{
    fontFamily:"BalooTammudu2-SemiBold",
    fontSize:24,
    color:"#161616"
  }
})
const mapStateToProps=(state)=>({
  token:state.user.token,
  server:state.config.server
})
export default connect(mapStateToProps) (InitConnection);
