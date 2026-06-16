const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
      ⚠️ {message}
    </div>
  );
};

export default ErrorMessage;
