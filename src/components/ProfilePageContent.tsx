
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePageContent() {
    const { toast } = useToast();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // In a real app, you would save this data.
        // For now, we'll just show a notification.
        toast({
            title: "پروفایل ذخیره شد",
            description: "اطلاعات شما (به صورت نمایشی) ذخیره شد.",
        });
    };

    return (
        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>اطلاعات شما</CardTitle>
                    <CardDescription>این اطلاعات برای شخصی‌سازی تجربه شما در برنامه استفاده خواهد شد.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">نام</Label>
                            <Input id="name" placeholder="نام خود را وارد کنید" />
                        </div>

                        <div className="space-y-2">
                            <Label>جنسیت</Label>
                            <RadioGroup defaultValue="not-specified" className="flex items-center gap-4 pt-2">
                                <div className="flex items-center space-x-2 space-x-reverse">
                                    <RadioGroupItem value="male" id="male" />
                                    <Label htmlFor="male">مرد</Label>
                                </div>
                                <div className="flex items-center space-x-2 space-x-reverse">
                                    <RadioGroupItem value="female" id="female" />
                                    <Label htmlFor="female">زن</Label>
                                </div>
                                <div className="flex items-center space-x-2 space-x-reverse">
                                    <RadioGroupItem value="not-specified" id="not-specified" />
                                    <Label htmlFor="not-specified">ترجیح می‌دهم نگویم</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        
                        <Button type="submit" className="w-full">ذخیره تغییرات</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
