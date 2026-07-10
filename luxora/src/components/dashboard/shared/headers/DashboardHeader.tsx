import React from 'react';
import { ShieldCheck } from 'lucide-react';

export interface DashboardHeaderProps {
  name: string;
  avatarUrl?: string;
  avatarFallback?: React.ReactNode;
  subtitle: React.ReactNode;
  badges?: string[];
  tags?: { label: string; icon?: React.ElementType }[];
  actions?: React.ReactNode; // Grid of Quick Action Buttons
  showVerifiedBadge?: boolean;
}

export function DashboardHeader({
  name,
  avatarUrl,
  avatarFallback,
  subtitle,
  badges = [],
  tags = [],
  actions,
  showVerifiedBadge = false
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={name} 
              className="h-24 w-24 rounded-2xl object-cover border-4 border-navy-800 shadow-xl"
            />
          ) : avatarFallback ? (
            avatarFallback
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gold-gradient text-4xl font-bold text-navy-900 border-4 border-navy-800 shadow-xl">
              {name.charAt(0)}
            </div>
          )}
          {showVerifiedBadge && (
            <div className="absolute -bottom-2 -right-2 bg-gold-400 text-navy-900 rounded-full p-1.5 shadow-lg border-2 border-navy-900" title="Verified">
              <ShieldCheck className="h-4 w-4" />
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-heading text-3xl font-bold text-cream">{name}</h1>
            {badges.map((badge, i) => (
              <span key={i} className="bg-gold-400/20 text-gold-400 text-xs px-2.5 py-1 rounded-full font-semibold tracking-wide border border-gold-400/30">
                {badge}
              </span>
            ))}
          </div>
          <div className="text-ink/60 font-medium mb-3">{subtitle}</div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => {
                const Icon = tag.icon;
                return (
                  <div key={i} className="flex items-center gap-1.5 bg-navy-800 border border-white/5 rounded-full px-3 py-1 text-xs text-ink/70">
                    {Icon && <Icon className="h-3 w-3" />}
                    {tag.label}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {actions && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
