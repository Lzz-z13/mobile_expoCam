import React from "react";
import { View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();

    const handleCam = () => {
        navigation.navigate("Cam");
    }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Abrir Câmera" onPress={handleCam} color="blue" />
    </View>
  );
};
export default HomeScreen;
