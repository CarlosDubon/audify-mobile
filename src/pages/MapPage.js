import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import io from 'socket.io-client'
const MapPage = () => {
  const [myPosition, setMyPosition] = useState(null);
  useEffect(() => {
    try {
      Geolocation.watchPosition(position => {
        setMyPosition(position.coords);
      }, error => {
        console.log(error);
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(()=>{
    const socket = io("localhost:3030")
    socket.emit("position",{lat:myPosition?.longitude,lang:myPosition?.longitude})
  },[])

  if(!myPosition){
    return <></>
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
});

export default MapPage;
