import { Search } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"

export function SearchInput({
  value,
  onChange,
  total,
}: {
  value: string
  onChange: (val: string) => void
  total: number
}) {
  return (
    <InputGroup className="!w-100">
      <InputGroupInput
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        {total} {total === 1 || total === 0 ? "result" : "results"}
      </InputGroupAddon>
    </InputGroup>
  )
}
