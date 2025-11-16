export default function SuccessModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-sm border border-gray-700">
        
        <div className="flex flex-col items-center text-center">
          
          <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">✓</span> 
          </div>
          
          <h2 className="text-xl font-bold text-green-400 mb-2">
            Success! 🎉
          </h2>
          
          <p className="text-gray-300 mb-6">
            {message}
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-500 transition-colors shadow-md"
          >
            OK
          </button>
        </div>
        
      </div>
    </div>
  );
}