import React, { useState } from "react";
import { Button, Modal, Text, TextInput } from "react-native-paper";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { colors } from "../theme/colors";
import { connect } from "react-redux";
import { setServerURI } from "../redux/actions/config";

const Preferences = ({setServerURI,server,show,onClose}) => {
  const [serverText,setServerText] = useState(server)
  const onSubmit=()=>{
    setServerURI(serverText)
    onClose()
  }
  return (
    <Modal
     visible={show}
     contentContainerStyle={Styles.mainContainer}
     onDismiss={onClose}
    >
      <View style={{
        flex:1
      }}>
        <View style={{flexDirection:"row"}}>
          <View style={{flex:1,alignItems:"center"}}>
            <Text style={{
              fontSize:24,
              fontFamily:"BalooTammudu2-SemiBold",
              marginTop:4,
              marginStart:32
            }}>
              Preferencias
            </Text>
          </View>
          <Pressable onPress={onClose}>
            <Icon name={"close"} color={colors.primary} size={28} style={{padding:8}} />
          </Pressable>
        </View>
        <View style={{
          flex:1,
          padding:16
        }}>
          <View>
            <TextInput label={"Dirrección del servidor"} value={serverText} onChangeText={text=>setServerText(text)} />
          </View>
        </View>
        <View style={{
          margin:16
        }}>
          <Button contentStyle={{
            backgroundColor:colors.primary,
          }}
          labelStyle={{
            color:colors.light
          }}
          onPress={onSubmit}
          >
            Aceptar
          </Button>
        </View>
      </View>
    </Modal>
  );
};
const Styles = StyleSheet.create({
  mainContainer:{
    width:Dimensions.get("window").width - Dimensions.get("window").width/8,
    height:250,
    backgroundColor:"#fff",
    alignSelf:"center",
    borderRadius:8
  }

})
const mapStateToProps=(state)=>({
  server:state.config.server
})
const dispatchStateToProps={
  setServerURI
}
export default connect(mapStateToProps,dispatchStateToProps)  (Preferences);
