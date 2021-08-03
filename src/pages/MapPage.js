/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';
import { connect } from 'react-redux';
import UserPreferences from '../modals/UserPreferences';
import axios from 'axios';
import PlacesContainer from '../components/PlacesContainer';
import { io } from 'socket.io-client';
import CompassHeading from 'react-native-compass-heading';
import { getDistance, getRhumbLineBearing } from "geolib";
import { getEarthAngleFromArc, getGeoVelocityComponents, getNewPosition } from '../utils';
import Toast from 'react-native-toast-message';
import { updateToken } from "../redux/actions/user";

const MapPage = (props) => {
  const [show,setShow] = useState(false);
  const [places,setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const mapRef = useRef();


  const [myPosition, setMyPosition] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0);

  const [mapPosition, setMapPosition] = useState({latitude: 0, longitude: 0});

  //Smoth variables
  const SECONDS = 0.25; //Time in seconds
  const MIN_DISTANCE = 1; //Meters

  const SHORT_DISTANCE = 10;
  const MEDIUM_DISTANCE = 50;
  const LARGE_DISTANCE = 100;

  const DELTA_SHORT = 1.3 * SECONDS;
  const DELTA_MEDIUM = 2 * SECONDS;
  const DELTA_LARGE = 4 * SECONDS;

  const {followUser} = props

  useEffect(() => {
    const degree_update_rate = 5;

    CompassHeading.start(degree_update_rate, ({heading, accuracy}) => {
      setCompassHeading(heading);
    });

    return () => {
      CompassHeading.stop();
    };
  }, []);

  useEffect(() => {

    const positionInterval = setInterval(myPositionCallback,SECONDS * 1000)
    return ()=>{
      clearInterval(positionInterval);
    }
  }, []);

  const myPositionCallback=() => {
    Geolocation.getCurrentPosition(position => {
        if (!myPosition) {
          setMyPosition({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });
          setMapPosition({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          })
          return;
        }

        setMyPosition(prev => {
          const current = {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          };


          const previous = prev || current;

          /* console.log("-------------------");
          console.log("Previus:",previous)
          console.log("Current:",current) */

          const distanceDiff = getDistance(previous, current, 0.01);
          if (distanceDiff < MIN_DISTANCE) {
            return current;
          }
          if (distanceDiff > LARGE_DISTANCE) {
            return current;
          }

          let deltaMeters = 0;

          if (distanceDiff > MIN_DISTANCE && distanceDiff <= SHORT_DISTANCE) {
            deltaMeters = DELTA_SHORT;
          }

          if (distanceDiff > SHORT_DISTANCE && distanceDiff <= MEDIUM_DISTANCE) {
            deltaMeters = DELTA_MEDIUM;
          }

          if (distanceDiff > MEDIUM_DISTANCE && distanceDiff <= LARGE_DISTANCE) {
            deltaMeters = DELTA_LARGE;
          }

          const angle = getRhumbLineBearing(previous, current);
          const deltaArc = getEarthAngleFromArc(deltaMeters);
          const velocityComponents = getGeoVelocityComponents(deltaArc, SECONDS, angle);

          /* console.log("DistanceDif:",distanceDiff)
          console.log("DeltaMeters:",deltaMeters)
          console.log("Angulo:",angle)
          console.log("velocity:",velocityComponents)
          console.log("Delta arc",deltaArc) */

          const newPosition = getNewPosition(previous, velocityComponents, SECONDS);

          /* console.log("New Position", newPosition);
          console.log("-------------------"); */

          return newPosition;
        });

      }, error => { console.log(error); },
      { distanceFilter: 1, enableHighAccuracy: true, forceRequestLocation: true });
  }

  useEffect(() => {
    fetchPlaces();
  }, []);

  useEffect(() => {
    let socket = io(props.base,{
      auth: {
        token: props.token,
      },
      autoConnect:true,
      path:props.socket,

    });
    console.log(socket);
    socket.on('connect', () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });
    socket.on('speaker_update',(data)=>{
      if (data){
        console.log('Tick!');
        fetchPlaces();
      }

    });

    return ()=>{
      socket.disconnect();
    };

  }, []);

  useEffect(()=> {
    if(followUser){
      /* setMapPosition(myPosition);
      setMapHeading(compassHeading); */
      mapRef.current?.animateCamera({
        center: myPosition,
        heading: compassHeading,
        zoom: 20
      })
    }
  }, [myPosition, compassHeading, followUser]);

  const onSelectPlace = (place, isAdd) => {
    if (isAdd) {
      setSelectedPlaces([...selectedPlaces, place._id]);
    } else {
      setSelectedPlaces(selectedPlaces.filter(tplace => tplace !== place._id));
    }
  };


  const fetchPlaces = async ()=>{
    try {
      let res = await axios.get(`${props.server}/speaker`,{
        headers:{
          'Authorization':`Bearer ${props.token}`,
        },
      });
      setPlaces(res.data);
    } catch (e) {
      console.log(e);
      if(e.response){
        if(e.response.status===403){
          props.updateToken(null)
          Toast.show({
            type:"danger",
            text1:"Sesión expirado",
            text2:"Por favor ingrese nuevamente.",
          })
          props.navigation.replace("InitPage")
        }else{
          props.updateToken(null)
          Toast.show({
            type:"danger",
            text1:"Error interno",
            text2:"El servicio no se encuentra disponoble en estos momentos",
          })
          props.navigation.replace("InitPage")
        }
      }
    }
  };

  const getReferencePlace = (id)=>{
    return places.find(p=>p._id === id);
  };

  if (!myPosition) {
    return <></>;
  }

  return (
    <View style={Style.container}>
      <MapView
        ref={mapRef}
        style={Style.map}
        loadingEnabled
        camera={{
          center: mapPosition,
          heading: 0,
          zoom: 20,
          pitch: 1,
          altitude:1,
        }}
        zoomEnabled={!followUser}
        zoomTapEnabled={!followUser}
        rotateEnabled={!followUser}
        scrollEnabled={!followUser}
        showsCompass={false}
        showsUserLocation>
        <Marker
          flat
          anchor={{
            x: 0.5,
            y: 0.5
          }}
          coordinate={ myPosition }>
          <Image source={require('../theme/images/arrow.png')}
            style={{
              width: 32,
              height: 32,
              transform: [
                {rotate: `${- 360 + compassHeading}deg`}
              ]
            }} />
        </Marker>
        {
          selectedPlaces.map((mPlace, i) => {
            const place = getReferencePlace(mPlace);
            if (!place){
              return <></>;
            }
            return (
              <View key={place._id}>
                <Marker
                  anchor={{
                    x: 0.5,
                    y: 0.5
                  }}
                  coordinate={{ latitude: place.latitude, longitude: place.longitude }}>
                  <Image source={require('../theme/images/signal.png')} style={{ width: 20, height: 20 }} />
                </Marker>

                <Circle center={{ latitude: place.latitude, longitude: place.longitude }}
                        radius={place.radius}
                        fillColor={'rgba(45, 52, 54,0.3)'}
                        strokeColor={'rgba(45, 52, 54,0.5)'} />
              </View>
              );

        })
        }



      </MapView>
      <View style={Style.preferencesContainer} >
        <View style={Style.preferencesBtn}>
          <Pressable onPress={()=>setShow(true)}>
            <Icon name={'gear'} size={30} color={colors.light} />
          </Pressable>
        </View>
        {followUser || <View style={Style.preferencesBtn}>
          <Pressable onPress={()=> {
            followUser || mapRef.current?.animateCamera({
              heading: 0,
            })
          }}>
            <Icon name={'compass'} size={30} color={colors.light} />
          </Pressable>
        </View>}
        {followUser || <View style={Style.preferencesBtn}>
          <Pressable onPress={()=> {
            /* setMapZoom(prev => prev + 0.01);
            setMapPosition(myPosition)
            setMapHeading(compassHeading) */
            followUser || mapRef.current?.animateCamera({
              center: myPosition,
              heading: compassHeading,
              zoom: 20
            })
          }}>
            <Icon name={'location-arrow'} size={30} color={colors.light} />
          </Pressable>
        </View>}
      </View>
      <PlacesContainer compassHeading={compassHeading} places={places} mPosition={myPosition} onSelect={onSelectPlace} server={props.base+props.subfolder} />
      <UserPreferences show={show} onClose={()=>setShow(false)}  />
    </View>
  );


};

const Style = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  preferencesContainer:{
    position:'absolute',
    top:0,
    right:0,
  },
  preferencesBtn:{
    backgroundColor:colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:100,
    margin:8,
    height:50,
    width:50,
  },
});
const mapStateToProps = (state)=>({
  token:state.user.token,
  base:state.config.base,
  socket: state.config.socket,
  server:state.config.server,
  subfolder:state.config.subfolder,
  followUser: state.config.followUser
});
const dispatchStateToProps={
  updateToken
}
export default connect(mapStateToProps,dispatchStateToProps)(MapPage);
