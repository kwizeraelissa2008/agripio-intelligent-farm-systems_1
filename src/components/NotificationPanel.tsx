import { useApp } from '@/contexts/AppContext';
import { Bell, X, Check, CloudRain, Eye, TrendingUp, Droplets, AlertTriangle } from 'lucide-react';

interface NotificationPanelProps {
  onClose: () => void;
}

const typeIcons: Record<string, any> = {
  weather: CloudRain,
  disease: Eye,
  market: TrendingUp,
  irrigation: Droplets,
  investment: TrendingUp,
  system: Bell,
};

const severityStyles: Record<string, string> = {
  info: 'hsl(145 100% 39%)',
  warning: 'hsl(45 100% 51%)',
  critical: 'hsl(0 100% 66%)',
};

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { notifications, markAllRead, unreadCount, t } = useApp();

  return (
    <div className="glass-card overflow-hidden" style={{ maxHeight: '70vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'hsl(0 0% 12%)' }}>
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" style={{ color: 'hsl(145 100% 39%)' }} />
          <span className="font-semibold text-sm">{t('notifications')}</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: 'hsl(0 100% 66%)', color: 'white' }}>
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs flex items-center gap-1 hover:opacity-80 transition-opacity"
              style={{ color: 'hsl(145 100% 39%)' }}>
              <Check className="w-3 h-3" /> Mark all read
            </button>
          )}
          <button onClick={onClose} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 56px)' }}>
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            <Bell className="w-8 h-8 mx-auto mb-3 opacity-30" />
            No notifications
          </div>
        ) : (
          notifications.map(notif => {
            const Icon = typeIcons[notif.type] || Bell;
            const color = severityStyles[notif.severity];
            return (
              <div key={notif.id} className="flex gap-3 px-4 py-3 border-b transition-all hover:bg-white/3"
                style={{ borderColor: 'hsl(0 0% 10%)', background: notif.read ? 'transparent' : 'hsl(145 100% 39% / 0.03)' }}>
                <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5"
                  style={{ background: color + '20' }}>
                  {notif.severity === 'critical' 
                    ? <AlertTriangle className="w-4 h-4" style={{ color }} />
                    : <Icon className="w-4 h-4" style={{ color }} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug">{notif.title}</p>
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: color }} />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.message}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="tag" style={{ fontSize: '10px', padding: '1px 6px', textTransform: 'capitalize' }}>{notif.type}</span>
                    <span className="text-xs text-muted-foreground">{timeAgo(notif.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
