import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import io from "socket.io-client";
import { SERVER_URI, SOCKET_URI } from "../theme/ServerConection";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../theme/colors";
import { connect } from "react-redux";
import UserPreferences from "../modals/UserPreferences";
import CompassHeading from 'react-native-compass-heading';
import axios from "axios";

const MapPage = (props) => {
  const [myPosition, setMyPosition] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0);
  const [audioType,setAudioType]=useState(1)


  const [show,setShow] = useState(false)

  const [enabled,setEnabled]=useState(false)
  const [socket,setSocket] = useState(null)


  useEffect(() => {
    try {
      Geolocation.watchPosition(position => {
        setMyPosition(position.coords);
      }, error => {
        console.log(error);
      },{
        enableHighAccuracy:true,
        distanceFilter:1
      });
    } catch (e) {
      console.log(e);
    }
  }, []);
  useEffect(() => {
    const degree_update_rate = 3;

    CompassHeading.start(degree_update_rate, ({heading, accuracy}) => {
      setCompassHeading(heading);
      console.log("compass",heading)
    })

    return () => {
      CompassHeading.stop();
    };
  }, []);

  useEffect(()=>{
    const socket = io(props.socket,{
      auth:{
        token:props.token
      }
    });
    setSocket(socket)
    setEnabled(true)

    return ()=>{
      socket.disconnect()
      setEnabled(false)
    }
  },[])

  useEffect(() => {
    if(enabled){
      try {
        console.log({ lat : myPosition?.latitude, long: myPosition?.longitude,rot:compassHeading,option:audioType })
        socket.emit("position", { lat : myPosition?.latitude, long: myPosition?.longitude,rot:compassHeading,option:audioType });

      }catch (e){
        console.log(e)
      }
    }

  }, [myPosition,compassHeading,audioType]);


  const fetchPlaces=async ()=>{
    try {
      let res = axios.get(``)
    }catch (e) {
      console.log(e)
    }
  }

  if (!myPosition) {
    return <></>;
  }
  return (
    <View style={Style.container}>
      <MapView
        style={Style.map}
        showsUserLocation
        region={{
          longitude: myPosition.longitude,
          latitude: myPosition.latitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        zoomEnabled

      />
      <View style={Style.preferencesBtn}>
        <Pressable onPress={()=>setShow(true)}>
          <Icon name={"gear"} size={30} color={colors.light} />
        </Pressable>
      </View>
      <UserPreferences show={show} onClose={()=>setShow(false)} onValueChange={setAudioType} value={audioType} />
    </View>
  );


};

const Style = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  preferencesBtn:{
    position:"absolute",
    top:0,
    right:0,
    backgroundColor:colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius:100,
    margin:8,
    height:50,
    width:50
  }
});
const mapStateToProps=(state)=>({
  token:state.user.token,
  socket:state.config.socket
})
export default connect(mapStateToProps) (MapPage);
