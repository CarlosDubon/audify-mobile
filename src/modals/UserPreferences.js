import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import { Button, Modal, Text, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/AntDesign";
import { colors } from "../theme/colors";
import React from "react";
import { Picker } from "@react-native-picker/picker";
import { StackActions, useNavigation } from "@react-navigation/native";

const UserPreferences = ({show,onClose,onValueChange,onValueSourceChange,soruceValue,value}) => {
  const navigation = useNavigation()
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
            <Text>Tipo de procesamiento de audio:</Text>
            <Picker selectedValue={value}
                    onValueChange={text=>onValueChange(text)}
            >
              <Picker.Item label={"Seleccinar"} value={0} />
              <Picker.Item label={"Intensidad de sonido"} value={1} />
              <Picker.Item label={"Cambio de frecuencia"} value={2} />
              <Picker.Item label={"Filtro pasas bajas"} value={3} />
            </Picker>
          </View>
          <View style={{marginTop:16}}>
            <Text>Cantidad de fuentes:</Text>
            <Picker selectedValue={soruceValue}
                    onValueSourceChange={text=>onValueChange(text)}
            >
              <Picker.Item label={"1 fuente"} value={0} />
              <Picker.Item label={"2 fuente"} value={1} />
              <Picker.Item label={"3 fuente"} value={2} />
              <Picker.Item label={"4 fuente"} value={3} />
            </Picker>
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
                  onPress={()=>{
                    navigation.dispatch(StackActions.popToTop())
                    navigation.navigate("InitPage")
                  }}

          >
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
    height:350,
    backgroundColor:"#fff",
    alignSelf:"center",
    borderRadius:8
  }

})

export default UserPreferences;
