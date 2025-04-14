import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-4 text-4xl font-bold">401 - Unauthorized</h1>
      <p className="mb-8 text-lg text-gray-600">
        You don't have permission to access this resource.
      </p>
      <Link
        to="/"
        className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
      >
        Return to Home
      </Link>
    </div>
  );
}
