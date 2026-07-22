import { useToast } from '../../../contexts/ToastContext';

export function useWorkflowToast() {
  const { showToast } = useToast();

  const showWorkflowToast = (actionName: string) => {
    showToast({
      type: 'info',
      title: actionName,
      description: 'This workflow will be available during backend integration.',
    });
  };

  return { showWorkflowToast };
}
