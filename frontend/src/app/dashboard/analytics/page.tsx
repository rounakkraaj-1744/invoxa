"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    BarChart3,
    TrendingUp,
    Users,
    DollarSign,
    Calendar,
    Download,
    ArrowUpRight,
    ArrowDownRight,
    Globe,
    Zap
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from "recharts";
import { motion } from "framer-motion";

const revenueData = [
    { name: 'Jan', total: 4200, recurring: 1200 },
    { name: 'Feb', total: 3800, recurring: 1200 },
    { name: 'Mar', total: 5100, recurring: 1500 },
    { name: 'Apr', total: 4800, recurring: 1500 },
    { name: 'May', total: 6200, recurring: 1800 },
    { name: 'Jun', total: 5800, recurring: 1800 },
    { name: 'Jul', total: 7500, recurring: 2100 },
    { name: 'Aug', total: 8200, recurring: 2100 },
];

const clientData = [
    { name: 'Acme Corp', value: 45 },
    { name: 'Globex Inc', value: 25 },
    { name: 'Soylent', value: 20 },
    { name: 'Initech', value: 10 },
];

const COLORS = ['#F59E0B', '#FBBF24', '#92400E', '#451A03'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-elevated border border-border-default p-4 rounded-xl shadow-2xl backdrop-blur-md">
                <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <p className="text-sm font-bold text-white">
                            {entry.name}: <span className="font-mono">${entry.value.toLocaleString()}</span>
                        </p>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function AnalyticsPage() {
    return (
        <div className="flex flex-col min-h-screen pb-20">
            <DashboardHeader title="Analytics" />
            <main className="p-6 space-y-8 bg-background radial-glow min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Performance Intelligence</h1>
                        <p className="text-sm text-text-tertiary">Real-time insights across your billing ecosystem.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" className="border-border-default text-text-secondary h-10 gap-2">
                            <Calendar size={14} />
                            <span>Last 12 Months</span>
                        </Button>
                        <Button variant="ghost" className="border-border-default text-text-secondary h-10">
                            <Download size={14} />
                        </Button>
                    </div>
                </div>

                {/* Growth Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "ARR", value: "$98.4k", trend: "+12.4%", isUp: true, icon: TrendingUp },
                        { label: "Active Clients", value: "142", trend: "+3", isUp: true, icon: Users },
                        { label: "Avg. Invoice", value: "$1,240", trend: "-2.1%", isUp: false, icon: Zap },
                        { label: "Conversion", value: "94.2%", trend: "+1.2%", isUp: true, icon: Globe },
                    ].map((stat, i) => (
                        <Card key={i} className="bg-surface/20 border-border-default overflow-hidden relative group">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-elevated rounded-lg">
                                        <stat.icon size={18} className="text-accent" />
                                    </div>
                                    <div className={`flex items-center gap-0.5 text-[10px] font-bold ${stat.isUp ? 'text-success' : 'text-error'}`}>
                                        {stat.isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                        {stat.trend}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white tracking-tighter mb-1">{stat.value}</h3>
                                <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{stat.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Revenue Chart */}
                    <Card className="lg:col-span-2 bg-surface/20 border-border-default">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-lg font-bold text-white mb-1">Revenue Trajectory</h2>
                                    <p className="text-xs text-text-tertiary font-medium">Comparison between total and recurring revenue.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                                        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Total</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-accent-muted" />
                                        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Recurring</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#92400E" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#92400E" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="6 6" stroke="rgba(63, 63, 70, 0.15)" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#71717A', fontSize: 10, fontWeight: 700 }}
                                            dy={15}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#71717A', fontSize: 10, fontFamily: 'var(--font-dm-mono)' }}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="total"
                                            stroke="#F59E0B"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorTotal)"
                                            activeDot={{ r: 6, strokeWidth: 0, fill: '#F59E0B' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="recurring"
                                            stroke="#92400E"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorRec)"
                                            strokeDasharray="5 5"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Client Distribution */}
                    <Card className="bg-surface/20 border-border-default">
                        <CardContent className="p-8">
                            <h2 className="text-lg font-bold text-white mb-1">Portfolio Distribution</h2>
                            <p className="text-xs text-text-tertiary font-medium mb-12">Revenue concentration by primary clients.</p>

                            <div className="h-[250px] w-full relative mb-12">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={clientData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={90}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {clientData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                    <p className="text-2xl font-black text-white">$24.2k</p>
                                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mt-1">Total PRF</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {clientData.map((client, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                            <span className="text-sm font-bold text-text-secondary">{client.name}</span>
                                        </div>
                                        <span className="text-xs font-mono font-bold text-white">{client.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Growth Insights Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-surface/20 border-border-default overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8">
                            <TrendingUp size={64} className="text-success/5" />
                        </div>
                        <CardContent className="p-8">
                            <Badge variant="accent" className="mb-4">Insight</Badge>
                            <h3 className="text-xl font-bold text-white mb-3">Strong Recurring Momentum</h3>
                            <p className="text-sm text-text-secondary leading-relaxed max-w-md">
                                Your recurring revenue has grown by 18% over the last 3 months. This provides a software-like predictability to your financial baseline.
                            </p>
                            <div className="mt-8 pt-8 border-t border-border-default flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                                    <DollarSign size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest">Next Payout</p>
                                    <p className="text-lg font-bold text-white">$4,500.00 · Mar 20</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-surface/20 border-border-default overflow-hidden">
                        <CardContent className="p-8">
                            <h3 className="text-lg font-bold text-white mb-6">Velocity Index</h3>
                            <div className="space-y-8">
                                {[
                                    { label: "Invoice Clearance", value: 84, color: "bg-accent" },
                                    { label: "Client Retention", value: 92, color: "bg-success" },
                                    { label: "Expansion Revenue", value: 45, color: "bg-info" },
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-xs font-bold text-text-tertiary uppercase tracking-widest">{item.label}</span>
                                            <span className="text-sm font-bold text-white">{item.value}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-elevated rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.value}%` }}
                                                transition={{ duration: 1, delay: i * 0.2 }}
                                                className={`h-full ${item.color}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
