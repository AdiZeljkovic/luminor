import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendType?: 'up' | 'down' | 'neutral';
    color?: string; // Optional custom accent color
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    trendType = 'neutral',
    color = "#0F172A"
}: StatCardProps) {
    return (
        <div className="card-bento p-6 relative overflow-hidden group">
            {/* Background Decoration */}
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-5 bg-current" style={{ color }} />

            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xs font-bold font-display uppercase tracking-widest text-gray-500 mb-1">{title}</h3>
                    <div className="text-3xl font-extrabold text-[#0F172A] font-display">{value}</div>
                </div>
                <div className="p-3 rounded-lg border-2 border-[#E2E8F0] text-[#0F172A] group-hover:border-[#0F172A] group-hover:bg-[#FF9F1C] transition-colors shadow-sm">
                    <Icon size={24} strokeWidth={2} />
                </div>
            </div>

            {trend && (
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className={`
                        px-2 py-0.5 rounded text-xs
                        ${trendType === 'up' ? 'bg-green-100 text-green-700' : ''}
                        ${trendType === 'down' ? 'bg-red-100 text-red-700' : ''}
                        ${trendType === 'neutral' ? 'bg-gray-100 text-gray-700' : ''}
                    `}>
                        {trendType === 'up' ? '↑' : trendType === 'down' ? '↓' : '•'} {trend}
                    </span>
                    <span className="text-gray-400 font-medium text-xs">vs last month</span>
                </div>
            )}
        </div>
    );
}
