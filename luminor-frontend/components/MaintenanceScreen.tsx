export default function MaintenanceScreen() {
    return (
        <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-4 text-center">
            <div className="w-24 h-24 mb-8 relative">
                <div className="absolute inset-0 bg-[#FF9F1C] blur-xl opacity-20 animate-pulse rounded-full"></div>
                <div className="relative z-10 text-6xl">🚧</div>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 font-display tracking-tight">
                Under <span className="text-[#FF9F1C]">Construction</span>
            </h1>

            <p className="text-gray-400 text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
                We're currently making some improvements to our website.
                We should be back shortly. Thank you for your patience!
            </p>

            <div className="flex gap-4">
                <a
                    href="mailto:contact@luminorsolution.com"
                    className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors font-medium"
                >
                    Contact Support
                </a>
            </div>

            <div className="mt-16 text-sm text-gray-600">
                &copy; {new Date().getFullYear()} Luminor Agencija
            </div>
        </div>
    );
}
