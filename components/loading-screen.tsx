"use client"

interface LoadingScreenProps {
  message?: string
}

export default function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6">
        {/* Netflix Logo */}
        <div className="text-4xl md:text-6xl font-black text-red-600">NETFLIX</div>

        {/* Simple Spinner */}
        <div className="relative">
          <div className="w-8 h-8 border-2 border-gray-600 rounded-full"></div>
          <div className="absolute top-0 left-0 w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Message */}
        <p className="text-gray-400 text-sm">{message}</p>
      </div>
    </div>
  )
}
