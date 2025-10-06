import { getMessaging, getToken } from "firebase/messaging";

const sendTokenToServer = async (subscription: PushSubscription) => {
  await fetch("/api/save-subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
};

export const requestNotificationPermission = async () => {
  const sw = await navigator.serviceWorker.ready;
  try {
    const subscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: "BHaz_uPK9Lh7IEDYnZ5fRO3vhv2sdWeB1CoqPeJmVKvu6RNyUSm0Ipbk_wIqc3psaPoWWoGKpCw8ZZFG7vJ6wv0",
    });
    await sendTokenToServer(subscription);
    return subscription;
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
    return null;
  }
};
