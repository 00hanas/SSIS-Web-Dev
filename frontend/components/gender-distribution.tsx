"use client"

import * as React from "react"
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer, TooltipProps } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { fetchStudentCountByGender } from "@/lib/student-api"

const COLORS = ["var(--accent)", "var(--popover-foreground)"]

function ThemedTooltip({ active, payload }: TooltipProps<number, string>) {
    if (active && payload && payload.length) {
        const item = payload[0]
        return (
        <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-md">
            <p className="font-medium text-foreground">{item.name}</p>
            <p className="text-muted-foreground">{item.value} students</p>
        </div>
        )
    }
    return null
}

export function ChartGenderDistribution() {
    const [data, setData] = React.useState<{ gender: string; count: number }[]>([])
    const [isClient, setIsClient] = React.useState(false)

    React.useEffect(() => {
        setIsClient(true)
        fetchStudentCountByGender()
        .then(setData)
        .catch((err) =>
            console.error("Failed to fetch gender distribution:", err)
        )
    }, [])

    if (!isClient) {
        return (
        <Card>
            <CardHeader className="pb-0">
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>Loading…</CardDescription>
            </CardHeader>
        </Card>
        )
    }

    return (
        <Card>
        <CardHeader className="pb-0">
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription className="pb-0">
            Showing proportion of students by gender
            </CardDescription>
        </CardHeader>
        <CardContent className="-mt-7 flex justify-center">
            <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie
                data={data}
                dataKey="count"
                nameKey="gender"
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={30}
                label
                >
                {data.map((entry, index) => (
                    <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    />
                ))}
                </Pie>
                <Tooltip content={<ThemedTooltip />} />
            </PieChart>
            </ResponsiveContainer>
        </CardContent>
        </Card>
    )
}
