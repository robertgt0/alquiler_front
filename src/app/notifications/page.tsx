// src/app/notifications/page.tsx
import SendNotificationForm from './SendNotificationForm';

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Notificaciones</h1>
      <SendNotificationForm />
    </div>
  );
}