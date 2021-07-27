/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Pressable, View } from "react-native";
import { Paragraph, Surface, Text, Title } from "react-native-paper";
import { getDistance } from "geolib";
import { Player } from "@react-native-community/audio-toolkit";
import LootieView from "lottie-react-native";
import { getVolumeFromExpDistance, getVolumeFromLinearDistance } from "../utils";

const PlaceCard = ({server,onSelect, mPosition, place }) => {
  const [player,setPlayer] = useState()
  const [playing,setPlaying] = useState(false)
  const [distance,setDistance] = useState(-1)

  useEffect(()=>{
    let tState;
    setPlaying(prevState => {
      if(prevState){
        tState = prevState
        return prevState
      }
      tState = prevState
      return false
    })
    if(player){
      player.stop()
      setPlayer(null)
    }
    let tplayer=new Player(place.sound.startsWith("/uploads")?`${server}${place.sound}`:place.sound)
    tplayer.looping=true
    setPlayer(tplayer)
    tplayer.volume = getVolume(place,distance)
    if (tState === true) {
      tplayer.play();
    }
  }, [place]);


  useEffect(()=>{
    setDistance(getDistance(
      { latitude: mPosition.latitude, longitude: mPosition.longitude },
      { latitude: place.latitude, longitude: place.longitude }))
  },[mPosition,place,playing])

  useEffect(()=>{
    if(playing && distance > -1){
      player.volume = getVolume(place,distance)
    }

  },[distance,mPosition,playing])

  const getVolume=(place,distance)=>{
    return place.type.id === 0 ? getVolumeFromLinearDistance(distance, place.radius) : getVolumeFromExpDistance(distance, place.radius)

  }
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
