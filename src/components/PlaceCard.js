import React, { createRef, useEffect, useState } from "react";
import { Dimensions, Pressable, View } from "react-native";
import { Paragraph, Title, Text, Surface } from "react-native-paper";
import { getDistance } from "geolib";
import { Player } from "@react-native-community/audio-toolkit";
import LootieView from "lottie-react-native";

const PlaceCard = ({server,onSelect, mPosition, place }) => {
  const [player,setPlayer] = useState(new Player(place.sound.startsWith("/uploads")?`${server}${place.sound}`:place.sound))
  const [playing,setPlaying] = useState(false)
  const [distance,setDistance] = useState(-1)

  useEffect(()=>{
    setDistance(getDistance(
      { latitude: mPosition.latitude, longitude: mPosition.longitude },
      { latitude: place.latitude, longitude: place.longitude }))
  },[mPosition])

  const playSound=()=>{
    player.looping = true

    if(playing){
      player.pause()
      onSelect(place,false)
    }else {
      player.play()
      onSelect(place,true)
    }
    setPlaying(!playing)

  }
  useEffect(()=>{
    if(playing && distance > -1){
      let volume = getVolumeFromDistance(distance)
      player.volume = volume
    }
  },[distance])
  const convertRange = ( value, r1, r2 ) => {
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
  }

  const clamp = (num, min, max) => {
    console.log(min)
    return Math.min(Math.max(num, min), max)
  }

  const getVolumeFromDistance = (d) => {
    const converted = convertRange(d, [15,0], [0,1]);
    return clamp(converted, 0, 1);
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
          <Title style={{ paddingTop: 4 }}>
            {place.name}
          </Title>
          {playing&&(
            <View>
              <LootieView
                autoPlay
                loop
                style={{
                  width:30,
                  height:30
                }}
                source={require("../theme/animation/sound.json")} />
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
