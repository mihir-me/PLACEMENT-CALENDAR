const DeleteConfirmModal = ({ event, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      <div className="relative bg-white w-full sm:max-w-sm sm:rounded-lg rounded-t-2xl border border-gray-200 shadow-xl safe-bottom
                      animate-slide-up sm:animate-none">
        {/* Drag handle on mobile */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="px-5 pt-4 sm:pt-5 pb-3">
          <h3 className="text-lg font-semibold text-gray-900">Delete Event?</h3>
        </div>

        <div className="px-5 pb-5">
          <p className="text-sm text-gray-600 mb-5">
            Are you sure you want to delete the <strong>{event.companyName}</strong> placement event?
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCancel}
              className="py-3 sm:py-2 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="py-3 sm:py-2 px-4 text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
