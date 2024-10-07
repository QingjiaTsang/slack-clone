"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter()

  return (
    <div >
      <h1>Hello World</h1>
      <Button onClick={() => router.push('/test')}>router to test</Button>
    </div>
  );
}
