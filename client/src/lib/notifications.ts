import { getMessaging, getToken } from "firebase/messaging";

// This function is placeholder for now.
// We will need a server endpoint to send the token to.
const sendTokenToServer = (token: string) => {
  console.log("Sending token to server:", token);
};

export const requestNotificationPermission = async () => {
  const messaging = getMessaging();
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, { vapidKey: "BHaz_uPK9Lh7IEDYnZ5fRO3vhv2sdWeB1CoqPeJmVKvu6RNyUSm0Ipbk_wIqc3psaPoWWoGKpCw8ZZFG7vJ6wv0" });
      sendTokenToServer(token);
      return token;
    }
    return null;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};
