// Simplified page to avoid blocking the build
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">StashIT</h1>
      <p className="text-xl mb-8">Inventory Management System</p>
      <div className="flex gap-4">
        <a href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">
          Login
        </a>
        <a href="/signup" className="px-4 py-2 border border-blue-600 text-blue-600 rounded">
          Sign Up
        </a>
      </div>
    </div>
  )
}
