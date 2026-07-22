import { MessagingUI } from '../../../components/messaging/MessagingUI';

export default function Messages() {
  return (
    <div className="h-[calc(100vh-8rem)] min-h-[600px] w-full max-w-7xl">
      <MessagingUI userRole="Property Manager" />
    </div>
  );
}
