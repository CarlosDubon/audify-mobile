import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../theme/colors";
import { connect } from "react-redux";
import UserPreferences from "../modals/UserPreferences";
import axios from "axios";
import PlacesContainer from "../components/PlacesContainer";

const MapPage = (props) => {
  const [myPosition, setMyPosition] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0);
  const [audioType,setAudioType]=useState(1)
  const [show,setShow] = useState(false)
  const [enabled,setEnabled] =useState(false)
  const [places,setPlaces] = useState([])

  const [selectedPlaces,setSelectedPlaces]=useState([])

  useEffect(() => {
    try {
      Geolocation.watchPosition(position => {
        setMyPosition({
          longitude:position.coords.longitude,
          latitude:position.coords.latitude,
          latitudeDelta: 0.0009,
          longitudeDelta: 0.0009,
        });
      }, error => {
        console.log(error);
      },{
        enableHighAccuracy:true,
        distanceFilter:1.5
      });
    } catch (e) {
      console.log(e);
    }
  }, []);




  useEffect(() => {
    if(enabled){
      try {
        console.log({ lat : myPosition?.latitude, long: myPosition?.longitude,rot:compassHeading,option:audioType })

      }catch (e){
        console.log(e)
      }
    }

  }, [myPosition,compassHeading,audioType]);

  useEffect(()=>{
    fetchPlaces()
  },[])

  const onSelectPlace=(place,isAdd)=>{
    if(isAdd){
      setSelectedPlaces([...selectedPlaces,place])
    }else{
      setSelectedPlaces(selectedPlaces.filter(tplace=>tplace._id !==place._id))
    }
  }


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
          selectedPlaces.map(place=> (
            <>
              <Marker coordinate={{latitude:place.latitude,longitude:place.longitude}} />
              <Circle center={{latitude:place.latitude,longitude:place.longitude}}
                      radius={place.radius}
                      fillColor={"rgba(45, 52, 54,0.5)"}
                      strokeColor={"rgba(45, 52, 54,1.0)"} />
            </>

          ))
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
