import { View, ActivityIndicator, Dimensions, Platform, Text } from "react-native";

const Loader = ({ isLoading, message = 'טוען...' }) => {
  const osName = Platform.OS;
  const screenHeight = Dimensions.get("screen").height;

  if (!isLoading) return null;

  return (
    <View
      className="absolute flex justify-center items-center w-full h-full bg-primary/60 z-10"
      style={{
        height: screenHeight,
      }}
    >
      <ActivityIndicator
        animating={isLoading}
        color="#fff"
        size="large"
      />
      <Text className="text-white mt-4 text-lg font-semibold tracking-wide">
        {message}
      </Text>
    </View>
  );
};

export default Loader;