import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from "react-native";
import React from "react";
import BucketImg from "../../assets/BucketImg.svg";
import Card from "../../assets/requestCard.svg";
import Home2 from "../../assets/Home2.svg";
import Home3 from "../../assets/Home3.svg";
import Home4 from "../../assets/Home4.svg";
import Home5 from "../../assets/Home5.svg";
import Home6 from "../../assets/Home6.svg";
import Home7 from "../../assets/Home7.svg";
import BackArrow from "../../assets/BackArrow.svg";


import ThumbIcon from "../../assets/ThumbIcon.svg";
import { useNavigation } from "@react-navigation/native";

const TermsandConditions = () => {
  const navigation = useNavigation();

  const { width } = Dimensions.get("window");

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View className="flex items-center gap-[32px] bg-white">
        <View className="z-50 absolute left-[16px] " style={{marginTop:25}}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{ padding: 20, borderRadius: 100 }}
            >
              <BackArrow />
            </TouchableOpacity>
          </View>

          <Text
            className="text-center pt-[40px] text-[16px]  "
            style={{ fontFamily: "Poppins-Bold" }}
          >
            Terms & Conditions
          </Text>
          <Text
            className="text-[14px]  text-[#2E2C43] mt-[20px] px-[32px]"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            How it works?
          </Text>
          <BucketImg />

          <View className="flex flex-col  px-[32px]">
            <Text
              className="text-[14px] text-center text-[#001B33]"
              style={{ fontFamily: "Poppins-Regular" }}
              
            >
              CulturTap Genie is a platform where Genie connects you with
              customers online. You need to attract customers by offering the
              best price for your products or services.
            </Text>
          </View>
          <View className="flex flex-col justify-center items-center gap-2 ">
            <Text
              className="text-[14px]   px-[32px] text-center"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              You get a notification first, like this.
            </Text>
            <View
              className="flex flex-row  justify-center items-center mx-[20px]"
              style={{
                backgroundColor: "#fff", // Ensure the background is white
                // margin: 10, // Add some margin if necessary for better shadow visibility
                shadowColor: "#bdbdbd",
                shadowOffset: { width: 9, height: 9 },
                shadowOpacity: 0.7,
                shadowRadius: 50,
                elevation: 80,
                borderRadius: 8,
              }}
            >
              {/* <Card width={350} className="object-cover shadow-xl" /> */}
              <View>
                <Image source={require('../../assets/requestCard.png')}/>
              </View>
            </View>
          </View>
          <View className="flex items-center gap-2 mb-[10px]">
            <Text
              className="text-[14px] px-[32px] text-[#001B33]  text-center"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              If you have the right product or service availability, you can
              accept the customer's request. 
            </Text>
            <View
              style={{
                backgroundColor: "#fff", // Ensure the background is white
                // margin: 10, // Add some margin if necessary for better shadow visibility
                shadowColor: "#bdbdbd",
                shadowOffset: { width: 9, height: 9 },
                shadowOpacity: 0.7,
                shadowRadius: 50,
                elevation: 80,
                borderRadius: 8,
              }}
            >
              {/* <Home2 width={350} className="" /> */}
              <View>
                <Image source={require('../../assets/Home3.png')}/>
              </View>
            </View>
          </View>
          <View className="gap-[20px]  items-center">
          <Text className="text-[14px]  px-[32px] text-center " style={{ fontFamily: "Poppins-Bold" }}>
                 Continue bargaining, accept {"\n"} suitable offer
                    </Text>
            <Text
              className="text-[14px] px-[32px]  text-[#001B33]  text-center"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              If you're okay with the price the customer offered, choose yes. If
              you're not okay with the price, choose no.
            </Text>
            <View
              style={{
                backgroundColor: "#fff", // Ensure the background is white
                // margin: 10, // Add some margin if necessary for better shadow visibility
                shadowColor: "#bdbdbd",
                shadowOffset: { width: 9, height: 9 },
                shadowOpacity: 0.7,
                shadowRadius: 50,
                elevation: 80,
                borderRadius: 8,
              }}
            >
              {/* <Home3 width={350} className=" " /> */}
              <View>
                <Image source={require('../../assets/Home2.png')}/>
              </View>
            </View>
          </View>
          <View className="gap-[24px]  items-center">
            <Text
              className="text-[14px] px-[32px]  text-[#001B33] text-center my-[10px]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              You can ask a question to a customer or make a new offer.
            </Text>
            <View
              style={{
                backgroundColor: "#fff", // Ensure the background is white
                // margin: 10, // Add some margin if necessary for better shadow visibility
                shadowColor: "#bdbdbd",
                shadowOffset: { width: 9, height: 9 },
                shadowOpacity: 0.35,
                shadowRadius: 50,
                elevation: 80,
                borderRadius: 8,
              }}
            >
              <Home7 width={350} className=" " />
            </View>
          </View>
          <View className="px-[32px] items-center gap-[30px] mt-[10px]">
            <Text
              className="text-[14px]  text-center"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              How to send offer to the customer?
            </Text>
            <View className="gap-[20px] items-center px-[32px]">
              <View className="flex-row gap-[5px] justify-center items-center">
                <Text
                  className="text-[14px] bg-[#FB8C00] p-2  text-white  text-center"
                  style={{ fontFamily: "Poppins-Medium" }}
                >
                  Step1.
                </Text>
                <Text
                  className="text-[14px]  text-[#001B33]  text-center"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  Type your response{" "}
                </Text>
              </View>
              <Home4 width={width} className=" " />
            </View>
            <View className="flex gap-[20px] px-[32px] items-center ">
              <View className="flex-row gap-[5px] ">
                <Text
                  className="text-[14px] bg-[#FB8C00] h-[40px] p-2    text-white   text-center "
                  style={{ fontFamily: "Poppins-Medium" }}
                >
                  Step 2.
                </Text>
                <Text
                  className="text-[14px]  text-[#001B33]text-center"
                  style={{ fontFamily: "Poppins-Regular" }}
                >Click the real product image for right product match and confirm availability.
                </Text>
              </View>
              <Home5 width={width} className=" " />
            </View>
            <View className="flex gap-[20px] ">
              <View className="flex-row gap-[5px] justify-center items-center">
                <Text
                  className="text-[14px] bg-[#FB8C00] p-2  text-white  text-center"
                  style={{ fontFamily: "Poppins-Medium" }}
                >
                  Step 3.
                </Text>
                <Text
                  className="text-[14px]  text-[#001B33] text-center"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  Type your offered price to the customer{" "}
                </Text>
              </View>
              <Home6 width={width} className=" " />
            </View>
          </View>
          <View className="gap-[20px] -mt-[10px] items-center">
            <Text
              className="text-[14px] px-[32px] text-[#001B33]   text-center"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Preview & Send your offer
            </Text>

            <View style={styles.container}>
              <Text style={styles.title}>Terms for requests 
              </Text>
              <View>
              <View style={styles.listItem}>
                <Text style={styles.dot}></Text>
               
                <Text style={{fontFamily:"Poppins-Regular",fontSize:14,color:"#2E2C43"}}>
                <Text style={styles.boldText}>Do's:</Text>
                  {" "}
                  Only accept customer requests if you have the product
                  available. Authenticity and honesty are crucial to us and our
                  customers.
                </Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.dot}></Text>
                
                <Text style={{fontFamily:"Poppins-Regular",fontSize:14,color:"#2E2C43"}}>
                <Text style={styles.boldText}>Don’ts:</Text>
                  {" "}
                  Customer complaints may lead to a permanent account block or a
                  significant penalty to unlock the account.
                </Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.dot}></Text>
                <Text style={{fontFamily:"Poppins-Regular",fontSize:14,color:"#2E2C43"}}>
                <Text style={styles.boldText}>Support:</Text>
                  {" "}
                  Tell us what you want to start, and we'll create your business
                  category.
                </Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.dot}></Text>
                <Text style={{fontFamily:"Poppins-Regular",fontSize:14,color:"#2E2C43"}}> 
                <Text style={styles.boldText}>Grow Your Business:</Text>
                {" "}
                We will help you attract and keep customers.</Text>
              </View>
            </View>
            </View>
            <Text className="text-[14px] px-[32px] text-center mb-2 border-[1px] py-[10px] " style={{fontFamily:"Poppins-Regular",borderColor:"green",color:"green"}}>There are charges like 100 rupees for 1000 customers. So please accept and proceed with the customer's request carefully. Only accept requests when you have the right product availability.</Text>
             <Text className="text-[14px] px-[32px] text-center mb-2"style={{fontFamily:"Poppins-Regular"}}>Unlock Your Business Potential – Download CulturTap Genie Business and Transform Your Sales Now!</Text>

            <ThumbIcon className=" " />
          </View>
          <View className="flex flex-col gap-[32px] px-[32px] my-[40px]">
             
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TermsandConditions;

const styles = StyleSheet.create({
  container: {
   
    // justifyContent:"center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontFamily:"Poppins-Black",
    marginTop: 10,
    
    marginBottom: 30,
  },
  listItem: {
    marginBottom: 10,
    paddingHorizontal:32,
    flexDirection:"row",
    gap:4
    // justifyContent:"center",
    // alignItems:"center"
  

  },
  boldText: {
    fontFamily:"Poppins-SemiBold"
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 5,
    backgroundColor: "black",
    marginTop:8.5
   
  },
});
