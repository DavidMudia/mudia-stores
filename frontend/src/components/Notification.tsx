import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Notification() {
  const { notification, showNotification } = useApp();
  if (!notification) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className="fixed top-20 right-4 z-[100] animate-slide-in">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-lg ${colors[notification.type]}`}>
        {icons[notification.type]}
        <span className="text-sm font-medium">{notification.message}</span>
        <button
          onClick={() => showNotification('', 'info')}
          className="ml-2 opacity-50 hover:opacity-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}