import { Separator } from "@/components/ui/separator"

export function VerticalSeparator() {
  return (
    <Separator
      orientation="vertical"
      className="h-full mx-2 w-[1px] bg-gray-300 dark:bg-gray-600"
    />
  )
}

export function HorizontalSeparator() {
  return (
    <Separator className="my-4 h-[1px] bg-gray-300 dark:bg-gray-600" />
  )
}
