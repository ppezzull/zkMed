interface InputWithCopyProps {
  label: string;
  value: string;
}

export const InputWithCopy = ({ label, value }: InputWithCopyProps) => {
  return (
    <div className="text-left">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}:</label>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={value}
          readOnly
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
        />
        <button
          onClick={() => navigator.clipboard.writeText(value)}
          className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Copy
        </button>
      </div>
    </div>
  );
}; 