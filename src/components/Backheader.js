import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

const Backheader = () => {
  const navigation = useNavigation()
  return (
    <View>
      <Pressable onPress={()=>navigation.goBack()} style={Styles.btn}>
        <Icon name={"back"} color={"#fff"} size={28}/>
      </Pressable>
    </View>
  );
};
const Styles=StyleSheet.create({
  btn:{
    backgroundColor:"#494848",
    alignSelf:"flex-start",
    marginStart:32,
    marginTop:32,
    height:50,
    width:50,
    borderRadius:25,
    justifyContent:"center",
    alignItems:"center"
  }
})
export default Backheader;
