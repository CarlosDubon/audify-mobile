import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../theme/colors";
import { connect } from "react-redux";
import UserPreferences from "../modals/UserPreferences";
import axios from "axios";
import PlacesContainer from "../components/PlacesContainer";
import { io } from "socket.io-client";

const MapPage = (props) => {
  const [myPosition, setMyPosition] = useState(null);
  const [audioType,setAudioType]=useState(1)
  const [show,setShow] = useState(false)
  const [enabled,setEnabled] =useState(false)
  const [places,setPlaces] = useState([])

  const [update, setUpdate] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  useEffect(() => {
    Geolocation.getCurrentPosition(position => setMyPosition({
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
      latitudeDelta: 0.0009,
      longitudeDelta: 0.0009,
    }), error => {
      console.log(error);
    });

    Geolocation.watchPosition(position => {
      setMyPosition({
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
        latitudeDelta: 0.0009,
        longitudeDelta: 0.0009,
      });
    }, error => {
      console.log(error);
    }, {
      enableHighAccuracy: true,
      distanceFilter: 1,
    });

  }, []);

  useEffect(() => {
    fetchPlaces();
  }, []);

  useEffect(() => {
    let socket = io("http://147.182.171.70",{
      auth: {
        token: props.token
      },
      autoConnect:true,
      path:"/api/socket.io"

    });
    console.log(socket)
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });
    socket.on("speaker_update",(data)=>{
      if(data){
        console.log("Tick!")
        fetchPlaces();
      }

    });

    return()=>{
      socket.disconnect()
    }

  }, []);

  const onSelectPlace = (place, isAdd) => {
    if (isAdd) {
      setSelectedPlaces([...selectedPlaces, place._id]);
    } else {
      setSelectedPlaces(selectedPlaces.filter(tplace => tplace !== place._id));
    }
  };


  const fetchPlaces=async ()=>{
    try {
      let res = await axios.get(`${props.server}/speaker`,{
        headers:{
          "Authorization":`Bearer ${props.token}`
        }
      })
      setPlaces(res.data)
    }catch (e) {
      console.log(e)
    }
  }
  const getReferencePlace=(id)=>{
    return places.find(p=>p._id===id)
  }
  if (!myPosition) {
    return <></>;
  }
  return (
    <View style={Style.container}>
      <MapView
        style={Style.map}
        showsUserLocation
        region={myPosition}
        loadingEnabled
        zoomEnabled

      >
        {
          selectedPlaces.map((mPlace, i) => {
            const place = getReferencePlace(mPlace)
            if(!place){
              return <></>
            }
            return(
              <View key={place._id}>
                <Marker

                  coordinate={{ latitude: place.latitude, longitude: place.longitude }}>
                  <Image source={require("../theme/images/audify.png")} style={{ width: 20, height: 20 }} />
                </Marker>
                <Circle center={{ latitude: place.latitude, longitude: place.longitude }}
                        radius={place.radius}
                        fillColor={"rgba(45, 52, 54,0.3)"}
                        strokeColor={"rgba(45, 52, 54,0.5)"} />
              </View>
              )

        })
        }



      </MapView>
      <View style={Style.preferencesBtn}>
        <Pressable onPress={()=>setShow(true)}>
          <Icon name={"gear"} size={30} color={colors.light} />
        </Pressable>
      </View>
      <UserPreferences show={show} onClose={()=>setShow(false)} onValueChange={setAudioType} value={audioType} />
      <PlacesContainer places={places} mPosition={myPosition} onSelect={onSelectPlace} server={props.socket} />
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
  server:state.config.server,
  socket:state.config.socket
})
export default connect(mapStateToProps) (MapPage);
