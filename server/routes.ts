import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import webpush from "web-push";

const vapidKeys = {
  publicKey: "BHaz_uPK9Lh7IEDYnZ5fRO3vhv2sdWeB1CoqPeJmVKvu6RNyUSm0Ipbk_wIqc3psaPoWWoGKpCw8ZZFG7vJ6wv0",
  privateKey: "s_hQK2GgDMCBQfNRBte2isk2Ty8rhvoKIFFU9i7B6y0",
};

webpush.setVapidDetails(
  "mailto:tech.journeysource@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

let subscriptions: webpush.PushSubscription[] = [];

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/save-subscription", (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
  });

  app.post("/api/send-notification", (req, res) => {
    const notificationPayload = {
      notification: {
        title: req.body.title,
        body: req.body.body,
        icon: "icon-192x192.png",
      },
    };

    const promises = subscriptions.map(sub => webpush.sendNotification(sub, JSON.stringify(notificationPayload)));
    Promise.all(promises)
      .then(() => res.sendStatus(200))
      .catch(err => {
        console.error("Error sending notification, reason: ", err);
        res.sendStatus(500);
      });
  });

  const httpServer = createServer(app);

  return httpServer;
}
