// lib/notifications.ts
import { postJson, getJson } from './api';

export async function sendNotification(data: {
  subject: string;
  message: string;
  destinations: { email: string }[];
  fromName?: string;
}) {
  return postJson('/notifications', data);
}

export async function listNotifications() {
  return getJson('/notifications');
}
