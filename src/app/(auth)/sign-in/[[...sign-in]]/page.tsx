import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';
// export default function Page() {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <SignIn />
//     </div>
//   );
// }

import { GalleryVerticalEnd } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Bisa website
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignIn />
          </div>
        </div>
      </div>
      <div className="bg-[#5b54ae] relative hidden lg:flex items-center justify-center">
        <div className="flex items-center justify-center w-full h-full">
          <Image
          src="/website-builder.png"
          alt="Image"
          width={450}
          height={450}
          className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}
