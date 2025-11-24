export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-md">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
        <p className="text-xs text-gray-500 mt-1">JinsiAI anaandika...</p>
      </div>
    </div>
  )
}