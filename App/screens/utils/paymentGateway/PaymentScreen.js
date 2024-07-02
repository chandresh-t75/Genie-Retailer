

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    Image,
    Pressable,
    ScrollView,
    TextInput
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { encode as btoa } from "base-64";
import Close from "../../../assets/Cross.svg";
// import PaymentImg from "../../assets/PaymentImg.svg";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import { setUserDetails } from "../../../redux/reducers/storeDataSlice";
import PaymentSuccessFulModal from "../../../components/PaymentSuccessFulModal";

const PaymentScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.storeData.userDetails);
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [verifiedCouponCode, setVerifiedCouponCode] = useState(false);
    const [couponFailed, setCouponFailed] = useState(false);
    const [couponCode, setCouponCode] = useState("");

    // console.log('userDetails at razorpay', userDetails);

    useEffect(() => {
        // console.log('lastSpade', userDetails.lastSpade);
        if (userDetails.lastPaymentStatus === "paid") {
            navigation.navigate("home");
        }
    }, []);
    const PayNow = async () => {
        const username = "rzp_live_oz8kr6Ix29mKyC";
        const password = "IADDTICFJ2oXYLX3H2pLjvcx";
        const credentials = `${username}:${password}`;
        const encodedCredentials = btoa(credentials);
        setLoading(true);
        try {
            const response = await axios.post(
                "https://api.razorpay.com/v1/orders",
                {
                    amount: 100,  // INR amount in paisa 1Rs = 100 paisa
                    currency: "INR",
                    receipt: userDetails._id,
                    notes: {
                        notes_key_1: "Welcome to CulturTap-Genie",
                        notes_key_2: "Eat-Sleep-Code-Repeat.",
                    },
                },
                {
                    headers: {
                        Authorization: `Basic ${encodedCredentials}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const order = response.data;

            var options = {
                description: "Payment for Genie-service",
                image:
                    "https://res.cloudinary.com/kumarvivek/image/upload/v1716890335/qinbdiriqama2cw10bz6.png",
                currency: "INR",
                key: "rzp_live_oz8kr6Ix29mKyC",
                amount: "100", // Amount in paise (20000 paise = 200 INR)
                name: "CulturTap-Genie",
                order_id: order.id, // Use the order ID created using Orders API.
                prefill: {
                    email: userDetails?.email,
                    contact: userDetails?.storeMobileNo,
                    name: userDetails?.storeName,
                },
                theme: { color: "#fb8c00" },
            };

            RazorpayCheckout.open(options)
                .then((data) => {
                    // handle success
                    // Alert.alert(`Success: ${data.razorpay_payment_id}`);
                    console.log("Payment Successful");

                    updateUserDetails();
                    setLoading(false);
                })
                .catch((error) => {
                    // handle failure
                    setLoading(false);
                    // Alert.alert(`Error: ${error.code} | ${error.description}`);
                    console.error(error);
                });
        } catch (error) {
            setLoading(false);
            console.error("Order creation failed:", error);
            Alert.alert("Order creation failed", error.message);
        }
    };

    const updateUserDetails = async () => {
        // setEditUser(false);
        // console.log('userNmae', userName);
        // if (userName.length < 3) return;

        await axios.patch(
            `http://173.212.193.109:5000/retailer/editretailer`,
            {
                _id: userDetails?._id,
                freeSpades: 1000,
            })
            .then(async (res) => {
                console.log("userData updated Successfully after payment ");
                dispatch(setUserDetails(res.data));
                console.log("res after user update", res.data);
                await AsyncStorage.setItem("userData", JSON.stringify(res.data));
                setIsVisible(true);
                setTimeout(() => {
                    setIsVisible(false);
                    navigation.navigate("home");
                }, 3000);
            })
            .catch((err) => {
                console.error("error while updating profile", err.message);
            });
    };


    // /////////////////////////////////////////////////////////////////////////////////////////////
    //Handle free spade
    // const handleFreeSpade = async () => {
    //     try {
    //         setLoading(true);
    //         await axios
    //             .patch("http://173.212.193.109:5000/user/edit-profile", {
    //                 _id: userDetails._id,
    //                 updateData: { freeSpades: userDetails.freeSpades - 1, lastPaymentStatus: "paid" },
    //             })
    //             .then(async (res) => {
    //                 console.log('Payment Successfully updated');
    //                 dispatch(setUserDetails(res.data));
    //                 await AsyncStorage.setItem("userDetails", JSON.stringify(res.data));
    //                 setIsVisible(true);
    //                 setTimeout(() => {
    //                     setIsVisible(false);
    //                     navigation.navigate("home");
    //                 }, 3000);
    //             })

    //     } catch (error) {
    //         setLoading(false);
    //         console.error("Error while sending free spade request:", error);
    //         Alert.alert("Error Sending Free Spade Request", error.message);
    //     }
    // }

    // //////////////////////////////////////////////////////////////////////////////////////
    // Verify coupon function
    const VerifyCoupon = async () => {
        console.log("Adding coupon");
        if (couponCode.length === 0) return;
        console.log('couponCode: ' + couponCode);
        try {
            await axios.get('http://173.212.193.109:5000/coupon/verify-coupon', {
                params: {
                    couponCode: couponCode
                }
            })
                .then(res => {
                    console.log('res', res.data);
                    if (res.data.message === "Coupon code is valid") {
                        setVerifiedCouponCode(true);
                        // dispatch(setSpadePrice(10));
                        // dispatch(setSpadeCouponCode(couponCode));
                    }
                    else {
                        setCouponFailed(true);
                    }
                })

        } catch (error) {
            setCouponFailed(true);
            console.log("Error while updating coupon code", error);
        }
    }
    // /////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView contentContainerStyle={{ flex: 1 }}>
                <View className="flex w-screen mt-[40px]" style={{ flex: 1 }}>
                    <View className="flex flex-row items-center pb-[20px] px-[32px]">
                        <Text
                            className="text-[16px]  flex-1 text-center"
                            style={{ fontFamily: "Poppins-Bold" }}
                        >
                            Payment Invoice
                        </Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Close />
                        </TouchableOpacity>
                    </View>
                    <View className="bg-[rgb(255,231,200)] px-[32px] py-[30px]">
                        <View className="flex-row items-center gap-2">
                            <Text
                                className="text-[14px] "
                                style={{ fontFamily: "Poppins-ExtraBold" }}
                            >
                                Date:
                            </Text>
                            <Text className="text-[14px]" style={{ fontFamily: "Poppins-Regular" }}>
                                12 June 2024
                            </Text>
                        </View>


                        <View className="flex-row gap-[10px] items-center ">
                            <Text
                                className=" text-[14px] "
                                style={{ fontFamily: "Poppins-ExtraBold" }}
                            >
                                Payment to:
                            </Text>
                            <Text className="text-[14px]" style={{ fontFamily: "Poppins-Regular" }}> CulturTap Tourism India</Text>

                        </View>

                        <Text
                            className="mt-[5px]"
                            style={{ fontFamily: "Poppins-Regular" }}
                        >
                            {userDetails?.storeName}
                        </Text>
                    </View>


                    <View className="px-[32px]">
                        <View>
                            <Text className="text-[14px]  text-[#2e2c43] mx-[6px] mt-[20px]" style={{ fontFamily: "Poppins-SemiBold" }}>Apply Coupon </Text>
                            <TextInput
                                placeholder='Type here...'
                                value={couponCode}
                                onChangeText={(val) => {
                                    // setPrice(val);
                                    // dispatch(setExpectedPrice(parseInt(price)));
                                    setCouponCode(val);
                                    console.log(couponCode);
                                    setCouponFailed(false);
                                    // console.log(expectedPrice);
                                }}
                                // keyboardType="numeric"
                                placeholderTextColor={"#558b2f"}
                                className="text-[14px] text-center bg-[#F9F9F9]  text-[#2e2c43]  mt-[10px]  rounded-3xl h-[54px] py-[10px] "
                                style={{ fontFamily: "Poppins-SemiBold" }}

                            />
                            {!verifiedCouponCode && !couponFailed && <TouchableOpacity onPress={() => { VerifyCoupon() }}>
                                <View className="w-full flex items-center justify-center border-2 border-[#fb8c00] py-[16px] mt-[40px]">
                                    <Text className="text-[14px]  text-[#fb8c00] " style={{ fontFamily: "Poppins-SemiBold" }}>Apply Coupon </Text>
                                </View>
                            </TouchableOpacity>}
                            {verifiedCouponCode && <View className="w-full flex items-center justify-center  py-[16px] mt-[40px]" style={{ border: 2, borderColor: '#558b2f', borderWidth: 2 }}>
                                <Text className="text-[14px]  text-[#558b2f] " style={{ fontFamily: "Poppins-SemiBold" }}>Coupon Added Successfully </Text>
                            </View>}
                            {couponFailed && <View className="w-full flex items-center justify-center  py-[16px] mt-[40px]" style={{ border: 2, borderColor: '#e76063', borderWidth: 2 }}>
                                <Text className="text-[14px]  text-[#E76063] " style={{ fontFamily: "Poppins-SemiBold" }}>Invalid Coupon Code </Text>
                            </View>}
                            <Text className="text-[14px] text-[#2e2c43] mt-[20px] " style={{ fontFamily: "Poppins-Regular" }}>If you have a coupon code available, you can enter the code here to redeem the offer.</Text>
                        </View>
                    </View>

                    <View className="px-[32px]">
                        <Text className="text-[16px]" style={{ fontFamily: "Poppins-ExtraBold" }}>Cost of 1000 customers</Text>
                        <Text className="text-[24px] text-[#558b2F]" style={{ fontFamily: "Poppins-SemiBold" }}>100 Rs</Text>
                        <Text className="text-[16px] text-[#E76063]" style={{ fontFamily: "Poppins-Regular" }}>Discount - 50 Rs</Text>
                        <Text className="text-[16px]" style={{ fontFamily: "Poppins-Regular" }}>Tax - 0 Rs</Text>
                        <Text className="text-[16px]" style={{ fontFamily: "Poppins-ExtraBold" }}>Total Cost</Text>
                        <Text className="text-[24px] text-[#558b2F]" style={{ fontFamily: "Poppins-SemiBold" }}>{verifiedCouponCode ? "50" : "100"} Rs</Text>
                    </View>

                </View>
                <View className="absolute bottom-[0px] left-[0px] right-[0px] gap-[10px]">
                    <TouchableOpacity
                        onPress={() => {
                            userDetails.freeSpades > 0 ? handleFreeSpade() : PayNow();
                        }}
                    >
                        <View className="w-full h-[63px]  bg-[#fb8c00] justify-center  bottom-0 left-0 right-0">
                            {loading ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                                <Text
                                    className="text-white  text-center text-[16px]"
                                    style={{ fontFamily: "Poppins-Black" }}
                                >
                                    Pay Now
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {
                isVisible && <PaymentSuccessFulModal isVisible={isVisible} setIsVisible={setIsVisible} />
            }
        </View>
    );
};

export default PaymentScreen;
