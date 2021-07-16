import React, { createRef, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Backheader from "../components/Backheader";
import { StackActions, useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import axios from "axios";
import { SERVER_URI } from "../theme/ServerConection";
import { connect } from "react-redux";

const SignUp = (props) => {
  const navigation = useNavigation();
  //Form
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rpassword, setRpassword] = useState("");

  //UI controller
  const [visiblePass, setVisiblePass] = useState(false);
  const [visibleRpass, setVisibleRpass] = useState(false);
  const [loading, setLoading] = useState(false);
  //Input refs
  const emailRef = createRef(null);
  const passRef = createRef(null);
  const RpassRef = createRef(null);

  const submit = async () => {
    setLoading(true);
    if (user !== "" && email !== "" && password !== "" && rpassword !== "") {
      if (password === rpassword) {
        try {
          let res = await axios.post(`${props.server}/auth/signup`, {
            username: user,
            email,
            password,
          });
          console.log(res);
          if (res.status === 409) {
            Toast.show({
              text1: "El usuario o correo electronico ya esta registrado.",
              text2: "Intente con otro correo electronico o usuario.",
              type: "info",
            });
            setLoading(false);
          }
          if (res.status === 201) {
            Toast.show({
              text1: "Usuario creado correctamente.",
              text2: "El usuario se creo correctamente, ya puedes ingresar con tus credenciales.",
              type: "success",
            });
            navigation.dispatch(
              StackActions.replace("Login"),
            );
            setLoading(false);
          }
        } catch (e) {
          console.log(e);
          setLoading(false);
        }
      } else {
        Toast.show({
          text1: "Contraseñas no coinciden.",
          text2: "Verifica los campos de contraseña.",
          type: "info",
        });
        setLoading(false);
      }
    } else {
      Toast.show({
        text1: "Campos vacios.",
        text2: "Verifica los campos, no pueden existir campos vacios.",
        type: "info",
      });
      setLoading(false);
    }

  };

  return (
    <View style={Styles.container}>
      <Backheader />
      <ScrollView style={Styles.content}>
        <View>
          <Text style={Styles.title}>
            Crea una nueva cuenta.
          </Text>
          <Text style={Styles.description}>
            Ingresa los datos solicitados para crear tu cuenta
          </Text>
        </View>
        <View style={{ marginTop: 32 }}>
          <View>
            <TextInput
              label={"Usuario"}
              onChangeText={text => setUser(text.trim())}
              value={user}
              dense
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current.focus()}
              blurOnSubmit={false}
            />
          </View>
          <View style={{ marginTop: 16 }}>
            <TextInput
              ref={emailRef}
              label={"Correo eléctronico"}
              onChangeText={text => setEmail(text)}
              keyboardType={"email-address"}
              dense
              returnKeyType="next"
              onSubmitEditing={() => passRef.current.focus()}
              blurOnSubmit={false}
            />
          </View>
          <View style={{ marginTop: 16 }}>
            <TextInput
              ref={passRef}
              label={"Contraseña"}
              dense
              onChangeText={text => setPassword(text)}
              secureTextEntry={!visiblePass}
              right={<TextInput.Icon onPress={() => setVisiblePass(!visiblePass)} name="eye" />}
              returnKeyType="next"
              onSubmitEditing={() => RpassRef.current.focus()}
              blurOnSubmit={false}
            />
          </View>
          <View style={{ marginTop: 16 }}>
            <TextInput
              ref={RpassRef}
              label={"Confirmar contraseña"}
              dense
              secureTextEntry={!visibleRpass}
              onChangeText={text => setRpassword(text)}
              right={
                <TextInput.Icon onPress={() => setVisibleRpass(!visibleRpass)} name="eye" />
              }
            />
          </View>
        </View>
        <View style={{ marginTop: 32, marginBottom: 64 }}>
          <View style={Styles.registerContent}>
            <Text style={Styles.description}>
              ¿Ya tienes una cuenta?
            </Text>
            <Pressable
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={[Styles.description, { marginStart: 8, color: "#fff" }]}>
                Iniciar sesión
              </Text>
            </Pressable>
          </View>
          <Button
            loading={loading}
            disabled={loading}
            onPress={submit} labelStyle={{ color: "#161616" }} contentStyle={Styles.primaryBtn}>Registrase</Button>
        </View>
      </ScrollView>
    </View>
  );
};
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161616",
  },
  content: {
    padding: 32,
  },
  title: {
    fontFamily: "BalooTammudu2-SemiBold",
    color: "#fff",
    fontSize: 32,

  },
  description: {
    color: "#848589",
    fontSize: 16,
  },
  primaryBtn: {
    backgroundColor: "#fff",
    paddingTop: 8,
  },
  registerContent: {
    flexDirection: "row",
  },
});
const mapStateToProps=(state)=>({
  server:state.config.server
})
export default connect(mapStateToProps) (SignUp);
