"use client"

import { AreaChartStudents } from "@/components/dashboard-ui/student-distribution"
import { WelcomeBanner } from "@/components/dashboard-ui/banner"
import { CardDemographic } from "@/components/dashboard-ui/cards"
import StudentList from "@/components/dashboard-ui/student-chart"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { ChartGenderDistribution } from "@/components/dashboard-ui/gender-distribution"
import { useAuth } from "@/hooks/useAuth"
import { DashboardSkeleton } from "@/components/global/dashboard-skeleton"
import { useEffect, useState } from "react"
import { loadColleges, loadPrograms, loadStudents } from "@/lib/loaders"

export default function DashboardPage() {
  const user = useCurrentUser()
  const { authenticated, loading } = useAuth()
  const [totalColleges, setTotalColleges] = useState(0)
  const [totalPrograms, setTotalPrograms] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)

  useEffect(() => {
    const fetchCollegesData = async () => {
      try {
        const { total } = await loadColleges()
        setTotalColleges(total)
      } catch (error) {
        console.error("Failed to load colleges:", error)
      }
    }
    fetchCollegesData()
  }, [])

  useEffect(() => {
    const fetchProgramsData = async () => {
      try {
        const { total } = await loadPrograms()
        setTotalPrograms(total)
      } catch (error) {
        console.error("Failed to load programs:", error)
      }
    }
    fetchProgramsData()
  }, [])

  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        const { total } = await loadStudents()
        setTotalStudents(total)
      } catch (error) {
        console.error("Failed to load students:", error)
      }
    }
    fetchStudentsData()
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }
  if (!authenticated && !loading) {
    return (
      <div className="text-muted-foreground py-6 text-center">
        Redirecting to login...
      </div>
    )
  }
  return (
    <div className="container w-full justify-center p-6">
      <div className="mb-5 flex flex-row gap-5">
        <div className="flex-1 flex-col space-y-5">
          <WelcomeBanner name={user?.name ?? "Guest"} />
          <CardDemographic
            colleges={totalColleges}
            programs={totalPrograms}
            students={totalStudents}
          />
          <AreaChartStudents />
        </div>

        <div className="ml-auto flex-col space-y-5">
          <div className="w-full">
            <StudentList />
          </div>
          <div className="w-full">
            <ChartGenderDistribution />
          </div>
        </div>
      </div>
    </div>
  )
}
