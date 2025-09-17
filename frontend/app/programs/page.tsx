import { CardDemographic } from "@/components/cards"

export default function ProgramsPage() {
  return (
    <div>
        <CardDemographic colleges={5} programs={12} students={300} />
      <h2 className="text-2xl font-bold">Programs</h2>
      <p>Here’s the list of programs.</p>
    </div>
  )
}
