import {
    View,
    Button,
    Image,
    Text,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    ActivityIndicator,
} from "react-native";
import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Send from "../assets/SendMessage.svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setOngoingRequests, setRequestInfo } from "../redux/reducers/requestDataSlice";
import { sendCustomNotificationDocument } from "../notification/notificationMessages";
import { socket } from "../screens/utils/socket.io/socket";
import { baseUrl } from "../screens/utils/constants";
import axiosInstance from "../screens/utils/axiosInstance";
import ErrorAttachment from "../assets/ErrorAttachment.svg"
import UnableToSendMessage from "./UnableToSendMessage";



const SendDocument = () => {

    const [query, setQuery] = useState("");
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const requestInfo = useSelector((state) => state.requestData.requestInfo || {});
    const user = useSelector(state => state.storeData.userDetails);
    const ongoingRequests = useSelector((state) => state.requestData.ongoingRequests || []);
    const route = useRoute();
    const { result, messages, setMessages } = route.params;
    const [isLoading, setIsLoading] = useState(false);
    const fileSize = parseFloat(result.assets[0].size) / (1e6);
    console.log('document result', result);
    const accessToken = useSelector((state) => state.storeData.accessToken);
  const [openModal, setOpenModal] = useState(false);



    const sendDocument = async () => {
        console.log('Sending document');
        try {
            setIsLoading(true);
            if (!result) {
                console.log('No document selected');
                setIsLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('bidImages', {
                uri: result.assets[0].uri,
                name: result.assets[0].name,
                type: result.assets[0].mimeType,
            });


            formData.append('sender', JSON.stringify({ type: "Retailer", refId: user?._id, }));
            formData.append('userRequest', requestInfo?.requestId?._id);
            formData.append('message', query);
            formData.append('bidType', "document");
            formData.append('chat', requestInfo?._id);
            formData.append('bidPrice', result.assets[0].size);
            const config = {
                headers:{
                  'Content-Type':'multipart/form-data',
                  'Authorization':`Bearer ${accessToken}`,
                }
               }
            await axiosInstance.post(`${baseUrl}/chat/send-message`, formData, config)
            .then(async (res) => {
                // console.log(res.data);
                if (res.status === 200) {
                  setOpenModal(true);
                //   setTimeout(() => {
                //       setOpenModal(false);
                //         const requestId=requestInfo?._id;
                //         navigation.navigate(`requestPage${requestId}`);
                //     setIsLoading(false);
                //   }, 2000);
              }
              if (res.status !== 201) return;
                    let mess = [...messages];
                    mess.push(res.data);
                    //  console.log("query update",mess);

                    setMessages(mess);
                    socket.emit("new message", res.data);

                    // setAttachmentScreen(false);
                    const filteredRequests = ongoingRequests.filter(
                        (request) => request._id !== requestInfo._id
                    );
                    const requests = ongoingRequests.filter(
                        (request) => request._id === requestInfo._id
                    );
                    const updatedRequest = { ...requests[0], updatedAt: new Date().toISOString(), unreadCount: 0 }

                    const data = [updatedRequest, ...filteredRequests];
                    dispatch(setOngoingRequests(data));
                    dispatch(setRequestInfo(updatedRequest));

                    const req = {
                        requestId: updatedRequest?._id,
                        userId: updatedRequest?.users[0]._id,
                        senderId:updatedRequest?.users[1]._id,
                    };

                    // console.log("notification send", notification);
                    const requestId = req?.requestId
                    navigation.navigate(`requestPage${requestId}`);
                    setIsLoading(false);
                    const config = {
                        headers:{
                          'Content-Type':'application/json',
                          'Authorization':`Bearer ${accessToken}`,
                        }
                       }
                    const token = await axiosInstance.get(
                        `${baseUrl}/user/unique-token?id=${requestInfo?.customerId._id}`,config
                    );
                    if (token.data.length > 0) {
                        const notification = {
                            token: token.data,
                            title: user?.storeName,
                            body: query,
                            requestInfo: {
                                requestId: requestInfo?._id,
                                userId: requestInfo?.users[1]._id
                            },
                            tag: user?._id,
                            redirect_to: "bargain",
                        };

                        sendCustomNotificationDocument(notification);
                    }
                })
                .catch(err => {
                    setIsLoading(false);
                    console.error(err);
                })
        } catch (error) {
            setIsLoading(false);
            console.error('Error while sending document', error);
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <View style={{ flex: 1 }}>
                <View className="flex-col items-center mt-[200px]">
                    <MaterialCommunityIcons name="file-document-multiple-outline" size={80} color="white" />
                    <Text className="text-white text-[16px] pt-[10px]">{result?.assets[0].name}</Text>
                    <Text className="text-white">{fileSize < 1 ? `${(parseFloat(fileSize).toFixed(3) * 1000)} kb` : `${parseFloat(fileSize).toFixed(1)}Mb`}</Text>
                </View>
                <KeyboardAvoidingView
                    behavior={"height"}
                    style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 20 }}
                >
                    <TextInput
                        placeholder="Add response..."
                        placeholderTextColor="white"
                        style={{
                            height: 64,
                            backgroundColor: "#001b33",
                            marginBottom: 0,
                            marginHorizontal: 15,
                            borderWidth: 2,
                            borderColor: "#fb8c00",
                            borderRadius: 30,
                            fontWeight: "bold",
                            paddingHorizontal: 30,
                            color: "white",
                        }}
                        onChangeText={(val) => {
                            setQuery(val);
                        }}
                        value={query}
                    />
                </KeyboardAvoidingView>
                <View className=" flex-row justify-between items-center mx-[25px] pb-[10px]">
                    <Text
                        className="text-white pl-[40px] capitalize"
                        style={{ fontFamily: "Poppins-SemiBold" }}
                    >
                        {requestInfo?.customerId.userName.length > 25 ? `${requestInfo?.customerId.userName.slice(0, 25)}...` : requestInfo?.customerId.userName}
                    </Text>
                    {isLoading &&
                        <View className="bg-[#fb8c00] p-[20px] rounded-full">
                            <ActivityIndicator size="small" color="#ffffff" />
                        </View>}

                    {!isLoading && <TouchableOpacity
                        onPress={() => {
                            sendDocument();
                        }}
                    >
                        <Send />
                    </TouchableOpacity>}
                </View>
      {openModal && <UnableToSendMessage openModal={openModal} setOpenModal={setOpenModal} errorContent="The attachment can not be sent because the customer sent you the new offer.Please accept or reject the customer offer before sending the new attachment" ErrorIcon={ErrorAttachment} />}

            </View>

        </View>
    )
}

export default SendDocument