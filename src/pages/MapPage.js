/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { Image, Pressable, StyleSheet, View, Text } from 'react-native';
import MapView, { Circle, Marker, Callout } from 'react-native-maps';
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

const MapPage = (props) => {
  const [audioType,setAudioType] = useState(1);
  const [show,setShow] = useState(false);
  const [places,setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const mapRef = useRef();


  const [myPosition, setMyPosition] = useState(null);

  const [compassHeading, setCompassHeading] = useState(0);
  const [mapZoom, setMapZoom] = useState(20);

  //Smoth variables
  const SECONDS = 0.3; //Time in seconds
  const MIN_DISTANCE = 1; //Meters

  const SHORT_DISTANCE = 10;
  const MEDIUM_DISTANCE = 50;
  const LARGE_DISTANCE = 100;

  const DELTA_SHORT = 1.3 * SECONDS;
  const DELTA_MEDIUM = 2 * SECONDS;
  const DELTA_LARGE = 4 * SECONDS;


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
          return;
        }

        setMyPosition(prev => {
          const current = {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          };


          const previous = prev || current;

          /* console.log("-------------------");
          console.log("Position", position);
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
    let socket = io('https://dei.uca.edu.sv',{
      auth: {
        token: props.token,
      },
      autoConnect:true,
      path:'/sraag-server/socket.io',

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

  const onSelectPlace = (place, isAdd) => {
    if (isAdd) {
      setSelectedPlaces([...selectedPlaces, place._id]);
    } else {
      setSelectedPlaces(selectedPlaces.filter(tplace => tplace !== place._id));
    }
  };

  const mapCameraHandler = () => {
    const map = mapRef.current;
    if(map){
      map.getCamera().then(camera => {
        if (camera.zoom > 10) {
          console.log(camera);
          setMapZoom(camera.zoom);
        }else{
          setMapZoom(10)
        }
      })
    }
  }

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
          center: {...myPosition},
          heading: compassHeading,
          zoom: mapZoom,
          pitch: 1,
          altitude:1,
        }}
        onTouchEndCapture={()=> mapCameraHandler()}
        zoomEnabled
        zoomTapEnabled
        rotateEnabled={false}
        scrollEnabled={false}
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
      <View style={Style.preferencesBtn}>
        <Pressable onPress={()=>setShow(true)}>
          <Icon name={'gear'} size={30} color={colors.light} />
        </Pressable>
      </View>
      <UserPreferences show={show} onClose={()=>setShow(false)} onValueChange={setAudioType} value={audioType} />
      <PlacesContainer compassHeading={compassHeading} places={places} mPosition={myPosition} onSelect={onSelectPlace} server={props.socket} />
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
  preferencesBtn:{
    position:'absolute',
    top:0,
    right:0,
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
  server:state.config.server,
  socket:state.config.socket,
});
export default connect(mapStateToProps)(MapPage);
