 
import { MessagingUI } from '../../../components/messaging/MessagingUI';

export default function Messages() {
  return (
    <div className="space-y-6 flex flex-col h-full pb-12">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Messages</h2>
          <p className="text-sm text-ink/60">Communicate with buyers, owners, agencies, admins and colleagues.</p>
        </div>
      </div>
      <div className="flex-1">
        <MessagingUI userRole="Agent" />
      </div>
    </div>
  );
}
