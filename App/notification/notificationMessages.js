import { getAccessToken, getAccessTokenRetailer } from "./notification";

export const BidAcceptedOtherRetailer = async (mess) => {
  console.log("notify", mess.token)

  try {
    const tokens = mess.token.slice(1);

    const accessToken = await getAccessTokenRetailer();

    const url = "https://fcm.googleapis.com/v1/projects/genie-retailer/messages:send"; // Replace YOUR_PROJECT_ID with your actual project ID

    const headers = {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${accessToken}`,
    };

    const notification = {
      notification: {
        title: `${mess.title} has accepted the bid at ${mess.price}`,
        body: mess.details,
        image: mess?.image,
      },
      android: {
        priority: "high",
        notification: {
          sound: "default"
        },
        data: {
          redirect_to: "requestPage",
          requestInfo: JSON.stringify(mess.requestInfo),
        },
      }
    }

    for (const token of tokens) {
      if (token?.length > 0) {
        const message = {
          message: {
            token: token,
            ...notification,
          },
        };

        const response = await fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(message),
        });

        const textResponse = await response.text();
        console.log("Raw response:", textResponse);

        if (!response.ok) {
          const errorResponse = JSON.parse(textResponse);
          if (errorResponse.error && errorResponse.error.code === 404) {
              continue;
              console.warn("Invalid token", `${token} has been skipped`);
          }
          else {
              console.error('Failed to send notification error:', textResponse);
              throw new Error('Failed to send notification');
          }
     
        } else {
          const successResponse = JSON.parse(textResponse);
          console.log(
            "Notification sent successfully:",

          );
        }
      }
    }
  } catch (e) {
    console.error("Failed to send notification:", e);
  }
};

export const sendCustomNotificationToSingleUser = async (mess) => {
  try {
    const message = {
      message: {
        token:
          "dDCcOdbBSHCBczVl8sM6AS:APA91bEWQ2KT0Q1JleNtv4-04pxPDj3Clm8pUf7VzoSjo4gNr-ZpczWTV727J8uHpWTFIrtJlTZSaW3VAbzAcFivT8PG2yBLgdDKv6nSXw46rCdRYPUpbbJu20szxai2saQp7QijsBPL",
        notification: {
          title: "Hello! How Are You?",
          body: "Hi there! Check out this beautiful image.",
          image:
            "https://images.pexels.com/photos/733860/pexels-photo-733860.jpeg",
        },
        android: {
          priority: "high",
        },
        data: {
          redirect_to: "requestPage",
        },
      },
    };

    const accessToken = await getAccessToken();

    const notificationResponse = await fetch(
      `https://fcm.googleapis.com/v1/projects/genie-retailer/messages:send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(message),
      }
    );

    const textResponse = await notificationResponse.text();
    console.log("Raw response:", textResponse);

    if (!notificationResponse.ok) {
      console.error("Failed to send notification error:", textResponse);
      throw new Error("Failed to send notification");
    } else {
      const successResponse = JSON.parse(textResponse);
      console.log("Notification sent successfully:", successResponse, message);
    }
  } catch (e) {
    console.error("Failed to send notification:", e);
  }
};

export const sendCustomNotificationChat = async (mess) => {
  // console.log("requestNotify",JSON.stringify(`${mess.requestInfo}`));
  console.log("token notify", mess.token)
  try {
    const message = {
      message: {
        token: mess?.token,
        notification: {
          title: mess.title,
          body: mess.body,
          // image: mess?.image,
        },
        android: {
          priority: "high",
          notification: {
            sound: "default",
            //   icon: "fcm_push_icon",
            // color:"#fcb800",
            tag: mess?.tag,
          },
        },
        data: {
          redirect_to: mess.redirect_to,
          requestInfo: JSON.stringify(mess.requestInfo),
        },
      },
    };

    const accessToken = await getAccessToken();
    console.log("access token", accessToken);
    // if(mess?.token.length > 0) {

    const notificationResponse = await fetch(`https://fcm.googleapis.com/v1/projects/genie-user/messages:send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(message),
      }
    );

    const textResponse = await notificationResponse.text();
    console.log("Raw response:", textResponse);

    if (!notificationResponse.ok) {
      console.error("Failed to send notification error:", textResponse);
      throw new Error("Failed to send notification");
    } else {
      const successResponse = JSON.parse(textResponse);
      console.log("Notification sent successfully:");
    }
    // }
  } catch (e) {
    console.error("Failed to send notification:", e);
  }
};

export const sendCustomNotificationBid = async (mess) => {
  console.log("notify", mess.token)

  try {
    const message = {
      message: {
        token: mess?.token,
        notification: {
          title: mess.title,
          body: `Offered Price: Rs ${mess.price}`,
          image: mess?.image,
        },
        android: {
          priority: "high",
          notification: {
            sound: "default",
            //   icon: "fcm_push_icon",
            //   color:"#fcb800",
            tag: mess?.tag
          },
        },
        data: {
          redirect_to: mess.redirect_to,
          requestInfo: JSON.stringify(mess.requestInfo),
          type:"Offer"
        },
      },
    };

    const accessToken = await getAccessToken();


    const notificationResponse = await fetch(
      `https://fcm.googleapis.com/v1/projects/genie-user/messages:send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(message),
      }
    );

    const textResponse = await notificationResponse.text();
    console.log("Raw response:", textResponse);

    if (!notificationResponse.ok) {
      console.error("Failed to send notification error:", textResponse);
      throw new Error("Failed to send notification");
    } else {
      const successResponse = JSON.parse(textResponse);
      console.log("Notification sent successfully:");
    }
  } catch (e) {
    console.error("Failed to send notification:", e);
  }
};
export const sendCustomNotificationAttachment = async (mess) => {
  console.log("notify", mess.token)

  try {
    const message = {
      message: {
        token: mess?.token,
        notification: {
          title: mess.title,
          body: mess.body,
          image: mess?.image,
        },
        android: {
          priority: "high",
          notification: {
            sound: "default",
            //   icon: "fcm_push_icon",
            //   color:"#fcb800",
            tag: mess?.tag
          },
        },
        data: {
          redirect_to: mess.redirect_to,
          requestInfo: JSON.stringify(mess.requestInfo),
        },
      },
    };

    const accessToken = await getAccessToken();

    const notificationResponse = await fetch(
      `https://fcm.googleapis.com/v1/projects/genie-user/messages:send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(message),
      }
    );

    const textResponse = await notificationResponse.text();
    console.log("Raw response:", textResponse);

    if (!notificationResponse.ok) {
      console.error("Failed to send notification error:", textResponse);
      throw new Error("Failed to send notification");
    } else {
      const successResponse = JSON.parse(textResponse);
      console.log("Notification sent successfully:");
    }

  } catch (e) {
    console.error("Failed to send notification:", e);
  }
};

export const sendCustomNotificationDocument = async (mess) => {
  console.log("notify", mess.token)

  try {
    const message = {
      message: {
        token: mess?.token,
        notification: {
          title: mess.title,
          body: "Sent a document",
        },
        android: {
          priority: "high",
          notification: {
            sound: "default",
            //   icon: "fcm_push_icon",
            //   color:"#fcb800",
            tag: mess?.tag
          },
        },
        data: {
          redirect_to: mess.redirect_to,
          requestInfo: JSON.stringify(mess.requestInfo),
        },
      },
    };

    const accessToken = await getAccessToken();

    const notificationResponse = await fetch(
      `https://fcm.googleapis.com/v1/projects/genie-user/messages:send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(message),
      }
    );

    const textResponse = await notificationResponse.text();
    console.log("Raw response:", textResponse);

    if (!notificationResponse.ok) {
      console.error("Failed to send notification error:", textResponse);
      throw new Error("Failed to send notification");
    } else {
      const successResponse = JSON.parse(textResponse);
      console.log("Notification sent successfully:");
    }

  } catch (e) {
    console.error("Failed to send notification:", e);
  }
};

export const NotificationRequestAccepted = async (mess) => {
  console.log("notify", mess.token)

  try {
    const message = {
      message: {
        token: mess?.token,
        notification: {
          title: `${mess.title} has accepted your request`,
          body: "Congrats!",
          image: mess?.image,
        },
        android: {
          priority: "high",
          notification: {
            sound: "default",
            //   icon: "fcm_push_icon",
            color: "#fcb800",
            // tag: "request_accept",
          },
        },
        data: {
          redirect_to: mess.redirect_to,
          requestInfo: JSON.stringify(mess.requestInfo),
        },
      },
    };

    const accessToken = await getAccessToken();
    // if(mess?.token.length>0){

    const notificationResponse = await fetch(
      `https://fcm.googleapis.com/v1/projects/genie-user/messages:send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(message),
      }
    );

    const textResponse = await notificationResponse.text();
    console.log("Raw response:", textResponse);

    if (!notificationResponse.ok) {
      console.error("Failed to send notification error:", textResponse);
      throw new Error("Failed to send notification");
    } else {
      const successResponse = JSON.parse(textResponse);
      console.log("Notification sent successfully:");
    }

  } catch (e) {
    console.error("Failed to send notification:", e);
  }
};
export const NotificationBidAccepted = async (mess) => {
  console.log("notify", mess.token)
  try {
    const message = {
      message: {
        token: mess.token,
        notification: {
          title: `${mess.title} has accepted the bid at ${mess.price}`,
          body: mess?.details,
          image: mess?.image,
        },
        android: {
          priority: "high",
          notification: {
            sound: "default",
            //   icon: "fcm_push_icon",
            // color: "#fcb800",
            // tag: "request_accept",
          },
        },
        data: {
          redirect_to: "bargain",
          requestInfo: JSON.stringify(mess.requestInfo),
        },
      },
    };

    const accessToken = await getAccessToken();


    const notificationResponse = await fetch(
      `https://fcm.googleapis.com/v1/projects/genie-user/messages:send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(message),
      }
    );

    const textResponse = await notificationResponse.text();
    console.log("Raw response:", textResponse);

    if (!notificationResponse.ok) {
      console.error("Failed to send notification error:", textResponse);
      throw new Error("Failed to send notification");
    } else {
      const successResponse = JSON.parse(textResponse);
      console.log("Notification sent successfully:");
    }

  } catch (e) {
    console.error("Failed to send notification:", e);
  }
};

export const NotificationBidRejected = async (mess) => {
  console.log("notify", mess.token)

  try {
    const message = {
      message: {
        token: mess?.token,
        notification: {
          title: `${mess.title} has rejected your bid`,
          body: "Hi,I have rejected your bid!",
          image: mess?.image,
        },
        android: {
          priority: "high",
          notification: {
            sound: "default",
            //   icon: "fcm_push_icon",
            color: "#fcb800",
            tag: "bid_reject",
          },
        },
        data: {
          redirect_to: mess.redirect_to,
          requestInfo: JSON.stringify(mess.requestInfo),
        },
      },
    };

    const accessToken = await getAccessToken();

    const notificationResponse = await fetch(
      `https://fcm.googleapis.com/v1/projects/genie-user/messages:send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(message),
      }
    );

    const textResponse = await notificationResponse.text();
    console.log("Raw response:", textResponse);

    if (!notificationResponse.ok) {
      console.error("Failed to send notification error:", textResponse);
      throw new Error("Failed to send notification");
    } else {
      const successResponse = JSON.parse(textResponse);
      console.log("Notification sent successfully:");
    }
  } catch (e) {
    console.error("Failed to send notification:", e);
  }
};
