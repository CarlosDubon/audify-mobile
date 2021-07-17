import React from "react";
import { Dimensions, ScrollView, View } from "react-native";
import PlaceCard from "./PlaceCard";

const PlacesContainer = (props) => {
  return (
    <ScrollView horizontal={true} style={{
      height:125,
      position:"absolute",
      bottom:0,
      left:15,
      width:Dimensions.get("window").width,
      marginBottom:16
    }}>
      {props.places.map((place,i)=>(<PlaceCard onSelect={props.onSelect} place={place} mPosition={props.mPosition} key={i} server={props.server} />))}
    </ScrollView>
  );
};

export default PlacesContainer;
