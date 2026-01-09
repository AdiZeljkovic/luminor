import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <h1 className="text-9xl font-bold text-yellow-500 mb-4 opacity-20">404</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 absolute mt-8">
                Stranica Nije Pronađena
            </h2>
            <p className="text-xl text-gray-600 max-w-md mb-8 relative z-10">
                Izgleda da ste zalutali. Stranica koju tražite ne postoji ili je premeštena.
            </p>
            <Link
                href="/"
                className="px-8 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-yellow-500 hover:text-gray-900 transition-colors relative z-10"
            >
                Vratite se na Početnu
            </Link>
        </div>
    );
}
