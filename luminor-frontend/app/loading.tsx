export default function Loading() {
    return (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
            <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
        </div>
    );
}
