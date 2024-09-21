import { View, Text, Pressable, Image, ScrollView, TouchableOpacity, Modal, Animated, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
// import ArrowLeft from '../../assets/arrow-left.svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome ,Entypo} from "@expo/vector-icons";
import BackArrow from "../../assets/BackArrow.svg";





const ViewRequestScreen = () => {
    const navigation = useNavigation();
    const requestInfo= useSelector(state => state.requestData.requestInfo);
    const [selectedImage, setSelectedImage] = useState(null);
    const [scaleAnimation] = useState(new Animated.Value(0));


    const handleImagePress = (image) => {
        setSelectedImage(image);
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      };
    
      const handleClose = () => {
        Animated.timing(scaleAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setSelectedImage(null));
      };

    return (
        <SafeAreaView style={{ flex: 1,backgroundColor:"white"}}>
            <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{ padding:30,paddingRight:10,zIndex:100,position:"absolute",top:8,left:10}}
          >
            <BackArrow  />
          </TouchableOpacity>
            <View className=" flex z-40 flex-row items-center justify-center mt-[30px] mb-[24px] mx-[36px]">
            
                <Text className="flex flex-1 justify-center items-center text-center text-[16px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Bold" }}>View Request</Text>
                {/* <Pressable onPress={() => { navigation.navigate('requestpreview'); }}>
                    <Text className="text-[14px]" ></Text>
                </Pressable> */}

            </View>

            <View className="mx-[34px] mt-[10px]">
                <Text className=" text-[#2e2c43] text-[14px]" style={{ fontFamily: "Poppins-Bold" }}>Spades of master</Text>
                <Text className=" mt-2" style={{ fontFamily: "Poppins-Regular" }}>{requestInfo?.requestId?.requestDescription}</Text>

                <Text className=" text-[#2e2c43] text-[14px] mt-[36px] mb-[15px]" style={{ fontFamily: "Poppins-Bold" }}>Reference images for vendors</Text>

                {/* <ScrollView horizontal={true} contentContainerStyle={{ flexDirection: 'row', gap: 4, paddingHorizontal: 5, }}>
                    {
                        requestInfo?.requestId?.requestImages?.map((image, index) => (
                            <View key={index}>
                                <Image source={{ uri: image }} style={{ height: 150, width: 120, borderRadius: 24, backgroundColor: '#EBEBEB' }} />
                            </View>
                        ))
                    }
                </ScrollView> */}
                <ScrollView horizontal  contentContainerStyle={{
                      paddingRight: 10,
                    //   marginTop: 10,
                    alignSelf:"flex-start",
                      flexDirection: "row",
                      gap: 4,
                    }}
                    showsHorizontalScrollIndicator={false}
                    style={{ maxHeight: 220 }}>
                  <View style={styles.container}>
                    <View style={styles.imageContainer}>
                      {requestInfo?.requestId?.requestImages?.map((image, index) => (
                        <Pressable
                          key={index}
                          onPress={() => handleImagePress(image)}
                        >
                          <View style={styles.imageWrapper}>
                            <Image
                              source={{ uri: image }}
                              style={styles.image}
                            />
                           
                          </View>
                        </Pressable>
                      ))}
                    </View>
                    <Modal
                      transparent
                      visible={!!selectedImage}
                      onRequestClose={handleClose}
                    >
                      <Pressable style={styles.modalContainer}  onPress={handleClose}>
                        <Animated.Image
                          source={{ uri: selectedImage }}
                          style={[
                            styles.modalImage,
                            {
                              transform: [{ scale: scaleAnimation }],
                            },
                          ]}
                        />
                        
                      </Pressable>
                    </Modal>
                  </View>
                </ScrollView>

                <Text className=" text-[#2e2c43] text-[14px] mt-[60px]" style={{ fontFamily: "Poppins-Bold" }}>Expected price</Text>
                <Text className="text-[#558b2f] " style={{ fontFamily: "Poppins-SemiBold" }}>{requestInfo?.requestId?.expectedPrice} Rs</Text>
            </View>





        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    overlay: {
      zIndex: 100,
      flex: 1,
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      //  position:"absolute",
      //  bottom:0// Semi-transparent greyish background
    },
  
    loadingContainer: {
      ...StyleSheet.absoluteFill,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    // menuContainer: {
    //     flex: 1,
    //     // Add other styles for menu container
    // },
    attachments: {
      zIndex: 100, // Ensure the overlay is on top
    },
    container: {
      flex: 1,
    },
    imageContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    //   marginHorizontal: 30,
      gap: 5,
      marginTop: 10,
    },
    imageWrapper: {
      margin: 5,
      borderRadius: 15,
      overflow: "hidden",
      // borderWidth: 1,
      // borderColor: "gray",
    },
    image: {
      width: 120,
      height: 160,
      borderRadius: 10,
    },
    // deleteIc: {
    //   position: 'absolute',
    //   top: 5,
    //   right: 5,
    // },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalImage: {
      width: 300,
      height: 400,
      borderRadius: 10,
    },
    closeButton: {
      position: "absolute",
      top: 20,
      right: 20,
    },
    deleteIcon: {
      position: "absolute",
      top: 5,
      right: 5,
      backgroundColor: "white",
      borderRadius: 50,
      padding: 2,
    },
    
  });

export default ViewRequestScreen