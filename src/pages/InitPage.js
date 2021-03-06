import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, StyleSheet, Image, Dimensions, Pressable, ScrollView, PermissionsAndroid } from "react-native";
import { StackActions, useNavigation } from "@react-navigation/native";
import { Button, Paragraph, Text } from "react-native-paper";
import Icon  from "react-native-vector-icons/FontAwesome";
import Preferences from "../modals/Preferences";
import { connect } from "react-redux";
import Toast from 'react-native-toast-message';

const InitPage = (props) => {
  const navigation = useNavigation()
  const [showPreferences,setShowPreferences]=useState(false)
  useLayoutEffect(()=>{
    console.log(props.token)
    if(props.token){
      navigation.dispatch(
        StackActions.replace('MapPage' )
      );
    }
  },[])
  useEffect(()=>{
    requestPermissions()
  },[])

  const requestPermissions=async ()=>{
    const req = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    if(granted){

    }else{
      Toast.show({
        type:"info",
        text1:"Por favor permitir el acceso de ubicación a la aplicación",
        text2:"La exepriencia de la aplicación se basa en el uso de la ubicación.",
        visibilityTime:2000
      })
      requestPermissions()
    }
  }
  return (
    <ScrollView style={Styles.container}>
      <View style={{alignItems:"flex-end"}}>
        <Pressable
          onPress={()=>setShowPreferences(true)}
        >
          <Icon style={{padding:16}} color={"#fff"} size={22} name={"gear"} />
        </Pressable>
      </View>
      <View style={Styles.bannerContainer}>
        <Image style={Styles.banner}
               source={require("../theme/images/audify-negativo.png")} />
      </View>
      <View style={Styles.content}>
       <View>
         <Text style={Styles.title} >¡Escuchalo todo!</Text>
       </View>
        <View style={{marginTop:32}}>
          <Paragraph style={Styles.description}>
            Escuha un objeto, una zona, una ciudad por medio de nuestra aplicación, recuerda utilizar audifonos para mejorar la experiencia de usuario.
          </Paragraph>
        </View>
        <View style={Styles.buttonContainer}>
          <View style={Styles.buttonGroup} >
            <Button
              onPress={()=>navigation.navigate("SignUp")}
              contentStyle={Styles.registerBtn} labelStyle={{color:"#161616"}} >
              Registrarse
            </Button>
            <Button
            onPress={()=>navigation.navigate("Login")}
              contentStyle={Styles.loginBtn} labelStyle={{
              color:"#fff",
            }} >
              Iniciar sesión
            </Button>
          </View>
        </View>
      </View>
      <Preferences show={showPreferences} onClose={()=>setShowPreferences(false)} />
    </ScrollView>
  );
};
const Styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#161616"
  },
  bannerContainer:{
    alignItems:"center",
  },
  banner:{
    width:Dimensions.get("window").width,
    height:250,
    resizeMode:"contain",
  },
  content:{
    padding:32,
    flex:1
  },
  title:{
    fontFamily:"BalooTammudu2-Bold",
    color:"#fff",
    textAlign:"center",
    fontSize:32,
  },
  description:{
    color:"#848589",
    fontSize: 16,
    paddingTop:8,
    textAlign: "justify"
  },
  buttonContainer:{
    flex:1,
    justifyContent:"flex-end",
    alignItems: "center"
  },
  buttonGroup:{
    flexDirection:"row",
    backgroundColor:"#3d3d3d",
    borderRadius: 30,

  },
  registerBtn:{
    height: 60,
    backgroundColor:"#fff",
    paddingHorizontal:16,
    borderRadius:32,
    paddingTop:8
  },
  loginBtn:{
    height: 60,
    paddingHorizontal:16,
    borderRadius:32,
    paddingTop:8
  }

})
const mapStateToProps=(state)=>({
  token:state.user.token,
})
export default connect(mapStateToProps) (InitPage);
