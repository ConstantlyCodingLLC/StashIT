import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-900 mb-4">StashIT</h1>

      <p className="text-xl md:text-2xl text-center text-gray-600 max-w-2xl mb-8">
        The complete inventory management solution for your business
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/login"
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
        >
          Create Account
        </Link>
      </div>

      <div className="mt-8">
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
          View Demo Dashboard
        </Link>
      </div>
    </div>
  )
}
