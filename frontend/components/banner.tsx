"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type WelcomeBannerProps = {
    name: string
}

export function WelcomeBanner({ name }: WelcomeBannerProps) {
    return (
        <Card
        className={`
            h-27 shadow-xl hover:scale-[1.01] hover:shadow-lg
        `}
        >
        <CardHeader className="pb-0">
            <CardTitle className="text-2xl font-bold">
            Welcome back, {name}!
            </CardTitle>
        </CardHeader>
        <CardContent className="-mt-7 text-muted-foreground">
            <p className="text-sm">
            Always stay updated in your student portal.
            </p>
        </CardContent>
        </Card>
    )
}
