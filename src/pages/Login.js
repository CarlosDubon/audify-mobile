import React, { createRef, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Backheader from "../components/Backheader";
import { Button, Text, TextInput } from "react-native-paper";
import Toast from 'react-native-toast-message';
import axios from "axios";
import { SERVER_URI } from "../theme/ServerConection";
import { updateToken } from "../redux/actions/user";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const Login = (props) => {
  const navigation = useNavigation()
  const [loading,setLoading]=useState(false)

  const [user,setUser]=useState("")
  const [password,setPassword] = useState("")

  const passwordRef = createRef()

  const submit=async ()=>{
    if(user!=="" && password!==""){
      try{
        console.log(props.server)
        setLoading(true)
        let res = await axios.post(`${props.server}/auth/signin`,{
          username:user,
          password
        })
        if(res.status===200){
          setLoading(false)
          props.updateToken(res.data.token)
          navigation.navigate("MapPage")
        }
        if(res.status === 409){
          Toast.show({
            text1:"Credenciales incorrectas.",
            text2:"Verifica los datos ingresados.",
            type:"error"
          })
        }
      }catch (e){
        console.log(e)
        setLoading(false)
      }
    }else {
      Toast.show({
        text1:"Campos vacíos",
        text2:"Verifica los campos enviados, no se permiten campos vacíos",
        type:"info"
      })
    }

  }

  return (
    <View style={Styles.container}>
      <Backheader />
      <ScrollView style={Styles.content}>
        <View>
          <Text style={Styles.title}>
            Iniciar sesión.
          </Text>
          <Text style={Styles.description}>
            ¡Bienvenido de vuelta! Ingresa tus datos para continuar.
          </Text>
        </View>
        <View style={{marginTop:32}}>

          <View style={{marginTop:16}}>
            <TextInput
              onChangeText={text=>setUser(text)}
              label={"Correo eléctronico o usuario"}
              underlineColor={"#fff"}
              returnKeyType={"next"}
              onSubmitEditing={()=>passwordRef.current.focus()}
              blurOnSubmit={false}
              dense
            />
          </View>
          <View style={{marginTop:16}}>
            <TextInput
              ref={passwordRef}
              onChangeText={text=>setPassword(text)}
              passwordRules={true}
              label={"Contraseña"}
              dense
              secureTextEntry
              right={<TextInput.Icon name="eye" />}
            />
          </View>

        </View>
        <View style={{marginTop:32, marginBottom:64}}>
          <View style={Styles.registerContent}>
            <Text style={Styles.description}>
              ¿Aún no tienes cuenta?
            </Text>
            <Text style={[Styles.description,{marginStart:8,color: "#fff"}]}>
              Crear nueva cuenta
            </Text>
          </View>
          <Button
            loading={loading}
            disabled={loading}
            onPress={submit}
            labelStyle={{color:"#161616"}} contentStyle={Styles.primaryBtn} >Iniciar sesión</Button>
        </View>
      </ScrollView>
    </View>
  );
};
const Styles=StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#161616"
  },
  content:{
    padding:32,
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
  registerContent:{
    flexDirection:"row"
  }
})

const dispatchStateToProps={
  updateToken
}
const mapStateToProps=(state)=>({
  server:state.config.server,
})
export default connect(mapStateToProps,dispatchStateToProps) (Login);
