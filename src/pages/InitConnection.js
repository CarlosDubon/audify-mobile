import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import LootieView from 'lottie-react-native'
import { Title } from "react-native-paper";
import io from "socket.io-client"
import { useNavigation } from "@react-navigation/native";
const InitConnection = () => {
  const navigation = useNavigation()
  const [dots,setDots]=useState(".")
  const [word,setWord]=useState(0)

  const words = ["Obteniendo usuario","Estableciendo una conexión","Preparando audifonos"]

  useEffect(()=>{
    createConnectionToServer()
  })
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

  const createConnectionToServer=()=>{
    const socket = io("localhost:8080")
    socket.on("make-request",data=>{
      navigation.navigate("MapPage")
    })
  }
  return (
    <View style={Style.container}>
      <View>
        <LootieView
          style={Style.animation}
          source={require("../theme/animation/loading.json")}
          autoPlay
          loop
        />
      </View>
      <View>
        <Title>{`${words[word]} ${dots}`}</Title>
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
  }
})
export default InitConnection;
