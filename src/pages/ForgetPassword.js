import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Backheader from "../components/Backheader";
import { Button, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import axios from "axios";
import { connect } from "react-redux";

const ForgetPassword = (props) => {
  const [email,setEmail]=useState("")
  const [loading,setLoading]=useState(false)

  const submit=async ()=>{
    setLoading(true)
    if(email!==""){
      try {
        let res = await axios.post(`${props.server}/auth/forgot-password`,{
          username:email
        })
        if(res.status===200){
          Toast.show({
            text1:"Correo enviado.",
            text2:"Revise su correo electronico",
            type:"success"
          })
          props.navigation.replace("Login")
        }
      }catch (e) {
        console.log(e)
        Toast.show({
          text1:"Error interno.",
          text2:"El servicio no se encuentra disponible, intente más tarde.",
          type:"error"
        })
        setLoading(false)
      }
    }else{
      Toast.show({
        text1:"Campo vacío.",
        text2:"Ingresa tu correo electronico",
        type:"error"
      })
      setLoading(false)
    }
  }

  return (
    <View style={Styles.container}>
      <Backheader />
      <View style={{padding:32}}>
        <Text style={Styles.title}>
          Recuperar contraseña
        </Text>
        <Text style={Styles.description}>
          Ingresa el correo o usuario el cual esta vinculado tu cuenta y se enviará un correo con las instrucciones.
        </Text>
        <View style={{marginTop:16}}>
          <TextInput
            onChangeText={text=>setEmail(text)}
            label={"Correo eléctronico o usuario"}
            underlineColor={"#fff"}
            dense
          />
        </View>
        <View style={{marginTop:16}}>
          <Button
            loading={loading}
            disabled={loading}
            onPress={submit}
            labelStyle={{color:"#161616"}} contentStyle={Styles.primaryBtn} >Enviar correo</Button>
        </View>
      </View>
    </View>
  );
};
const Styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#161616"
  },
  title:{
    fontFamily:"BalooTammudu2-SemiBold",
    color:"#fff",
    fontSize:32,

  },
  description:{
    color:"#848589",
    fontSize: 16
  },
  primaryBtn:{
    backgroundColor: "#fff",
    paddingTop:8,
  },
})
const mapStateToProps=(state)=>({
  server:state.config.server,
})
export default connect(mapStateToProps) (ForgetPassword);
