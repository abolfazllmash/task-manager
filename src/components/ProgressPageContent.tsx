
"use client"

import { useTaskContext } from './TaskProvider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { Task } from '@/lib/types';
import { format as formatDate } from 'date-fns-jalali';
import { faIR } from 'date-fns/locale';

const COLORS = {
    completed: 'hsl(var(--primary))',
    pending: 'hsl(var(--muted))',
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};


export default function ProgressPageContent() {
    const { tasks } = useTaskContext();

    const completedTasks = tasks.filter(task => task.completed);
    const pendingTasks = tasks.filter(task => !task.completed);
    const totalTasks = tasks.length;

    const now = new Date();
    const overdueTasks = pendingTasks.filter(task => task.dueDate && new Date(task.dueDate) < now);
    const upcomingTasks = pendingTasks
        .filter(task => task.dueDate)
        .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
        .slice(0, 5);


    const chartData = [
        { name: 'انجام شده', value: completedTasks.length, color: COLORS.completed },
        { name: 'باقی مانده', value: pendingTasks.length, color: COLORS.pending },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>نمای کلی پیشرفت</CardTitle>
                </CardHeader>
                <CardContent>
                    {totalTasks > 0 ? (
                        <ChartContainer config={{}} className="mx-auto aspect-square h-[250px]">
                            <PieChart>
                                <Tooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                            وظیفه‌ای برای نمایش وجود ندارد.
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>وظایف عقب‌افتاده ({overdueTasks.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {overdueTasks.length > 0 ? (
                            <ul className="space-y-2">
                                {overdueTasks.map(task => (
                                    <li key={task.id} className="flex justify-between items-center p-2 bg-destructive/10 rounded-md">
                                        <span>{task.title}</span>
                                        <span className="text-xs text-destructive font-semibold">
                                            {formatDate(new Date(task.dueDate!), 'd MMMM', { locale: faIR })}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-muted-foreground">هیچ وظیفه عقب‌افتاده‌ای ندارید. آفرین!</p>
                        )}
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>وظایف پیش رو</CardTitle>
                    </CardHeader>
                    <CardContent>
                       {upcomingTasks.length > 0 ? (
                            <ul className="space-y-2">
                                {upcomingTasks.map(task => (
                                    <li key={task.id} className="flex justify-between items-center p-2 bg-card-foreground/5 rounded-md">
                                        <span>{task.title}</span>
                                         <span className="text-xs text-muted-foreground">
                                             {formatDate(new Date(task.dueDate!), 'd MMMM yyyy', { locale: faIR })}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-muted-foreground">وظیفه‌ی زمان‌بندی شده‌ای برای آینده نزدیک ندارید.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

