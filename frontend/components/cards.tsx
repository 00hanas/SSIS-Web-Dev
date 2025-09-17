"use client"

import Link from "next/link"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

type CardDemographicProps = {
  colleges: number
  programs: number
  students: number
}

export function CardDemographic({ colleges, programs, students }: CardDemographicProps) {
  const data = [
    { title: "Total Colleges", value: colleges, href: "/colleges" },
    { title: "Total Programs", value: programs, href: "/programs" },
    { title: "Total Students", value: students, href: "/students" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {data.map((item) => (
        <Link key={item.title} href={item.href}>
          <Card
            className={`
              bg-gradient-to-t from-neutral-200 to-neutral-400 dark:from-neutral-800 dark:to-neutral-950
              transition-transform transform hover:scale-105 hover:shadow-lg
              cursor-pointer rounded-2xl
            `}
          >
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold justify-end">{item.value}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
