import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import { Button, Modal, Text, Switch } from "react-native-paper";
import Icon from "react-native-vector-icons/AntDesign";
import { colors } from "../theme/colors";
import React from "react";
import { Picker } from "@react-native-picker/picker";
import { StackActions, useNavigation } from "@react-navigation/native";
import { updateToken } from "../redux/actions/user";
import { connect } from "react-redux";
import { setFollowUser } from "../redux/actions/config";

const UserPreferences = ({updateToken,show,onClose,followUser,setFollowUser}) => {
  const navigation = useNavigation()

  const onChangeHandler = (value) => {
    setFollowUser(value)
  }
  return (
    <Modal
      visible={show}
      onDismiss={onClose}>
      <View style={Styles.mainContainer}>
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
          margin:16,
          flexDirection: "row",
          alignItems: "center" }}>
            <Text style={{flex: 2 }}> ¿Seguir al usuario? </Text>
            <Switch
              value={followUser}
              color={colors.primary}
              onValueChange={onChangeHandler}
              style={{flex:1}}/>
        </View>

        <View style={{ margin:16 }}>
          <Button
            contentStyle={{ backgroundColor:colors.primary, }}
            labelStyle={{
              color:colors.light
            }}
            onPress={()=>{
              updateToken(null)
              navigation.dispatch(
                StackActions.replace('InitPage' )
              );
            }}>
            Cerrar sesión
          </Button>
        </View>
      </View>
    </Modal>
  );
};
const Styles = StyleSheet.create({
  mainContainer:{
    width:Dimensions.get("window").width - Dimensions.get("window").width/8,
    minHeight: 150,

    backgroundColor:"#fff",
    alignSelf:"center",
    borderRadius:8
  }

})
const mapStateToProps=(state)=>({
  followUser: state.config.followUser
})
const mapDispatchToProps={
  updateToken,
  setFollowUser
}
export default connect(mapStateToProps,mapDispatchToProps) (UserPreferences);
