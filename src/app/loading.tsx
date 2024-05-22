import Image from "next/image"

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Image src="/banana_dance_transparent.gif" alt="loading" width={200} height={200}/>
    </div>
  )
}
