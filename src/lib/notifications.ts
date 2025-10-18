/*import api from "./api";

export const sendNotification = async (data: { to: string; subject: string; message: string }) => {
  const res = await api.post("/notifications/send", data);
  return res.data;
};*/
// lib/notifications.ts
import { postJson, getJson } from './api';

export async function sendNotification(pkg: any) {
  return postJson('/api/notifications', pkg);
}

export async function listNotifications() {
  return getJson('/api/notifications');
}

