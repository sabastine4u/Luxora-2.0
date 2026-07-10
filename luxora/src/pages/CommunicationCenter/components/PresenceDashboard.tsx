import { Users, Search, Filter, MonitorUp, Coffee } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { MOCK_USERS } from '../data/mockData';
import { OnlineIndicator } from './OnlineIndicator';
import { formatMessageTime } from '../utils/formatter';

export const PresenceDashboard = () => {
  const users = Object.values(MOCK_USERS);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-ink-dark/30">
      
      {/* Header */}
      <div className="h-16 border-b border-gray-100 dark:border-ink-light bg-white dark:bg-ink flex items-center justify-between px-6 shrink-0">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white flex items-center">
            <Users className="w-4 h-4 mr-2 text-gold-500" />
            Team Presence
          </h2>
          <p className="text-xs text-gray-500">Enterprise Availability Dashboard</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search team..."
              className="pl-9 pr-4 py-1.5 bg-gray-50 dark:bg-ink-light border border-gray-200 dark:border-ink rounded-lg text-sm focus:outline-none focus:border-gold-500 transition-colors"
            />
          </div>
          <GhostButton size="sm" className="w-9 h-9 p-0 rounded-lg border border-gray-200 dark:border-ink">
            <Filter className="w-4 h-4 text-gray-500" />
          </GhostButton>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          
          {users.map(user => (
            <div key={user.id} className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-4 flex items-center space-x-4 hover:shadow-md transition-shadow group">
              <div className="relative">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover bg-gray-100" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center text-gold-600 dark:text-gold-400 font-bold text-lg">
                    {user.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <OnlineIndicator status={user.onlineStatus} size="md" className="absolute -bottom-1 -right-1" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</h3>
                <p className="text-xs text-gray-500 truncate">{user.role} {user.department ? `• ${user.department}` : ''}</p>
                
                <div className="flex items-center mt-2 text-xs text-gray-400">
                  {user.onlineStatus === 'online' && <span className="text-emerald-500 font-medium">Active now</span>}
                  {user.onlineStatus === 'offline' && <span>Last seen {formatMessageTime(user.lastSeen || new Date().toISOString())}</span>}
                  {user.onlineStatus === 'busy' && <span className="flex items-center text-red-500"><MonitorUp className="w-3 h-3 mr-1" /> Deep Work</span>}
                  {user.onlineStatus === 'away' && <span className="flex items-center text-yellow-500"><Coffee className="w-3 h-3 mr-1" /> Away</span>}
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};
