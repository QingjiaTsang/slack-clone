import { Button } from "@/components/shadcnUI/button";

export default function TestPage() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-blue-500">
        Test Tailwind
      </h1>
      <Button variant="default" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Test Button
      </Button>
    </div>
  )
} 