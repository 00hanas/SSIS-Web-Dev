"use client"

import { AreaChartStudents } from "@/components/student-distribution"
import { WelcomeBanner } from "@/components/banner"
import { CardDemographic } from "@/components/cards"
import StudentList from "@/components/student-chart"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { ChartGenderDistribution } from "@/components/gender-distribution"

export default function DashboardPage() {
    const user = useCurrentUser()
    return (
        <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mb-5">
            <div className="col-span-3 space-y-5">
            <WelcomeBanner name={user?.name ?? "Guest"} />
            <CardDemographic colleges={27} programs={34} students={300} />
            <AreaChartStudents />
            </div>

            <div className="space-y-5">
            <StudentList />
            <ChartGenderDistribution />
            </div>
        </div>
        </div>
    )
}
