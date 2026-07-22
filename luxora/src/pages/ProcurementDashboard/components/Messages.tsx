import { MessagingUI } from '../../../components/messaging/MessagingUI';

export default function Messages() {
  return (
    <div className="h-[calc(100vh-8rem)]">
      <MessagingUI userRole="Procurement" />
    </div>
  );
}
