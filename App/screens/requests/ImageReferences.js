import { View, Text, Pressable, Image, ScrollView, TouchableOpacity, Animated, Modal,StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ArrowLeft from '../../assets/arrow-left.svg';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

const ImageReferences = () => {
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
        <View style={{ flex: 1 }}>
            <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 20, position: 'absolute', top: 25, left: 20, zIndex: 100 }} onPress={() => navigation.goBack()} >
                <ArrowLeft />
            </TouchableOpacity>
            <View className=" mt-[40px] mb-[24px]">

                <Text className=" text-center text-[16px]" style={{ fontFamily: "Poppins-Black" }}>Image References</Text>


            </View>

            <View>
                <Text className="text-[#2e2c43] mx-[50px] text-[14px] text-center mt-[24px] mb-[24px] " style={{ fontFamily: "Poppins-Regular" }}>Provided image references by the customer.</Text>
            </View>
           <ScrollView horizontal  contentContainerStyle={{
                                 paddingRight: 10,
                               //   marginTop: 10,
                               alignSelf:"flex-start",
                                 flexDirection: "row",
                                 gap: 4,
                               }}
                               showsHorizontalScrollIndicator={false}
                               style={{ maxHeight: 260 }}>
                             <View style={styles.container}>
                               <View style={styles.imageContainer}>
                                 {requestInfo?.requestId?.requestImages?.map((image, index) => (
                                   <Pressable
                                     key={index}
                                     onPress={() => handleImagePress(image)}
                                   >
                                     <View key={index} style={{ borderRadius: 24,marginRight:10 }}>
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




        </View >
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
      paddingLeft:20
    },
    imageWrapper: {
      margin: 5,
      borderRadius: 15,
      overflow: "hidden",
      // borderWidth: 1,
      // borderColor: "gray",
    },
    image: {
        height: 232, width: 174, borderRadius: 24,
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

export default ImageReferences