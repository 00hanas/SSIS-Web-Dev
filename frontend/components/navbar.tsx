import { ModeToggle } from "@/components/mode-toggle"

export function Navbar() {
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <h1 className="text-xl font-bold">SSIS</h1>
      <nav className="flex gap-4">
        <a href="/colleges">Colleges</a>
        <a href="/programs">Programs</a>
        <a href="/students">Students</a>
      </nav>
      <ModeToggle />
    </header>
  )
}
