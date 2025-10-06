"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"
import { fetchStudentCountsByProgram } from "@/lib/student-api"

export function AreaChartStudents() {
    const [data, setData] = React.useState<{ programCode: string; count: number }[]>([])

    React.useEffect(() => {
        fetchStudentCountsByProgram()
        .then(setData)
        .catch((err) => console.error("Failed to load chart data:", err))
    }, [])

    return (
        <Card className="h-107.5">
        <CardHeader>
            <CardTitle>Student Distribution</CardTitle>
            <CardDescription>
            Showing total number of students grouped by program.
            </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
            config={{
                count: { label: "Students", color: "var(--accent)" },
            }}
            className="aspect-auto h-[250px] w-full"
            >
            <AreaChart data={data}>
                <defs>
                <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.1} />
                </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="programCode"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                />
                <ChartTooltip
                cursor={false}
                content={
                    <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(value) => `Program: ${value}`}
                    />
                }
                />
                <Area
                dataKey="count"
                type="monotone"
                fill="url(#fillCount)"
                stroke="var(--primary)"
                />
                <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
            </ChartContainer>
        </CardContent>
        </Card>
    )
}
