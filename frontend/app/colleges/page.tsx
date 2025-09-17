import { CardDemographic } from "@/components/cards"
import { CollegeColumns, College } from "../table/college-columns"
import { DataTable } from "../table/data-table"

async function getData(): Promise<College[]> {
  // Mock college data
  return [
    { ccode: "CCS", name: "College of Computer Studies" },
    { ccode: "CAS", name: "College of Arts and Sciences" },
    { ccode: "CBA", name: "College of Business Administration" },
    { ccode: "COE", name: "College of Engineering" },
    { ccode: "CON", name: "College of Nursing" },
    { ccode: "CHS", name: "College of Health Sciences" },
    { ccode: "CED", name: "College of Education" },
    { ccode: "CFAD", name: "College of Fine Arts and Design" },
    { ccode: "CARCH", name: "College of Architecture" },
    { ccode: "CLAW", name: "College of Law" },
    { ccode: "CAGR", name: "College of Agriculture" },
    { ccode: "CVET", name: "College of Veterinary Medicine" },
    { ccode: "CENV", name: "College of Environmental Science" },
    { ccode: "CIT", name: "College of Industrial Technology" },
    { ccode: "CHUM", name: "College of Humanities" },
    { ccode: "CMASS", name: "College of Mass Communication" },
    { ccode: "CMED", name: "College of Medicine" },
    { ccode: "CMUS", name: "College of Music" },
    { ccode: "CPHY", name: "College of Physical Education" },
    { ccode: "CPSY", name: "College of Psychology" },
    { ccode: "CSOC", name: "College of Social Work" },
    { ccode: "CPOL", name: "College of Political Science" },
    { ccode: "CJOUR", name: "College of Journalism" },
    { ccode: "CIS", name: "College of Information Systems" },
    { ccode: "CMAR", name: "College of Maritime Studies" },
  ]
}


export default async function CollegesPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <CardDemographic colleges={5} programs={12} students={300} />

      <h2 className="text-2xl font-bold mt-6">Colleges</h2>
      <p className="mb-6">Here’s the list of colleges.</p>

      <DataTable columns={CollegeColumns} data={data} />
    </div>
  )
}
