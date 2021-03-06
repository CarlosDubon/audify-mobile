/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Pressable, View } from "react-native";
import { Paragraph, Surface, Text, Title } from "react-native-paper";
import { getDistance, getRhumbLineBearing } from "geolib";
import LootieView from "lottie-react-native";
import { getBalanceFromAngles, getVolumeFromExpDistance, getVolumeFromLinearDistance } from "../utils";
import Audio from "react-native-video";


const PlaceCard = ({ server, onSelect, mPosition, place, compassHeading }) => {
  const [distance, setDistance] = useState(-1);
  const [volume, setVolume] = useState(0);
  const [balance, setBalance] = useState(0);
  //Audio controls
  const [playing, setPlaying] = useState(false);
  const animation = useRef();

  useEffect(() => {
    setPlaying(prevState => {
      if (prevState) {
        return prevState;
      }
      return false
    })


  }, [place]);

  useEffect(() => {
    const tDistance = getDistance(
      { latitude: mPosition.latitude, longitude: mPosition.longitude },
      { latitude: place.latitude, longitude: place.longitude },
    );

    setDistance(tDistance);
    setVolume(getVolume(place, tDistance));
  }, [mPosition, place, playing])

  useEffect(()=>{
    setBalance(getBalance(mPosition, place, compassHeading));
  },[compassHeading, mPosition, place])

  const getBalance=(mPosition, place, mCompassHeading) => {
    let userToPlaceAngle = getRhumbLineBearing(
      { latitude: mPosition.latitude, longitude: mPosition.longitude },
      { latitude: place.latitude, longitude: place.longitude });
    let balance = getBalanceFromAngles(mCompassHeading, userToPlaceAngle);

    /* console.log("MY COMPASS:", mCompassHeading);
    console.log("PLACE ANGLE:", userToPlaceAngle);
    console.log("Balance:", balance); */

    return balance;
  }

  const getVolume=(place,distance)=>{
    return place.type.id === 0 ? getVolumeFromLinearDistance(distance, place.radius) : getVolumeFromExpDistance(distance, place.radius)

  }


  const playSound=()=>{

    if(playing){
      onSelect(place,false)
    }else {
      onSelect(place,true)
    }
    setPlaying(!playing)

  }
  const getSoundResource = (place, distance) => {
    const volume = getVolume(place, distance);

    if(volume === 0) return require("../theme/animation/sound-stopped.json");
    if(volume > 0 && volume <= 0.33) return require("../theme/animation/sound-red.json");
    if(volume > 0.33 && volume <= 0.67) return require ("../theme/animation/sound-orange.json");
    if(volume > 0.67) return require ("../theme/animation/sound-green.json");
  }

  if(distance > 1000) {
    return <></>
  }

  return (
    <Pressable onPress={()=> {
      playSound()
      ;
    }}>
      <Surface style={{
        width: (2 * Dimensions.get("window").width) / 3,
        height: 120,
        backgroundColor: "#fff",
        flexDirection: "column",
        borderRadius: 16,
        paddingVertical: 12,
        paddingStart: 16,
        elevation: 4,
        margin: 4,
        marginEnd: 16,
      }}>
        <View style={{
          flexDirection:"row",
          justifyContent:playing?"space-around":"flex-start",
          alignItems:"center"
        }}>
          <Audio
            source={{ uri: place.sound.startsWith("/uploads") ? `${server}${place.sound}` : place.sound }}
            audioOnly
            controls={false}
            repeat
            paused={!playing}
            volume={volume}
            stereoPan={balance}
          />
          <Title style={{ paddingTop: 4 }}>
            {place.name}
          </Title>
          {playing&&(
            <View>
              <LootieView
                ref={animation}
                autoPlay
                loop
                speed={1.5}
                style={{
                  width:30,
                  height:30
                }}
                source={getSoundResource(place, distance)} />
            </View>
          )}
        </View>
        <View style={{ marginTop: -12 }}>
          <Paragraph style={{ paddingTop: 8 }}>{place.latitude} , {place.longitude}</Paragraph>
        </View>
        <View>
          <Text>
            A{" "}
            {distance}
            {" metros de ti."}
          </Text>
        </View>
      </Surface>
    </Pressable>

  );
};

export default PlaceCard;
