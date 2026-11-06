import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface StatCardProps {
  title: string;
  value: any;
  icon: LucideIcon;
  color?: 'blue' | 'purple' | 'green' | 'orange';
  change?: string;
  loading?: boolean;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    icon: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
  },
  green: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    icon: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    icon: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
  },
};

export function StatCard({ title, value, icon: Icon, color = 'blue', change, loading }: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-gray-200 dark:border-navy-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <div className={clsx('p-2.5 rounded-xl', colors.iconBg)}>
          <Icon className={clsx('h-5 w-5', colors.icon)} />
        </div>
      </div>
      {loading ? (
        <div className="h-8 bg-gray-200 dark:bg-navy-700 rounded animate-pulse w-16" />
      ) : (
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {typeof value === 'object' ? (Array.isArray(value) ? value.length : 0) : value}
        </p>
      )}
      {change && !loading && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{change}</p>
      )}
    </div>
  );
}
