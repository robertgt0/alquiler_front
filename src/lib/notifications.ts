import api from "./api";

export const sendNotification = async (data: { to: string; subject: string; message: string }) => {
  const res = await api.post("/notifications/send", data);
  return res.data;
};
