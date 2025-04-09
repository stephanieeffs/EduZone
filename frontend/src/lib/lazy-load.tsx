import { lazy, Suspense } from "react";
import { LoadingFallback } from "../components/LoadingFallback";

export function lazyLoad(
  importFn: () => Promise<{ default: React.ComponentType }>,
  fallback: React.ReactNode = <LoadingFallback />
) {
  const LazyComponent = lazy(importFn);

  return function LazyLoadWrapper(props: Record<string, unknown>) {
    return (
      <Suspense fallback={fallback}>
        <div className="min-h-screen">
          <LazyComponent {...props} />
        </div>
      </Suspense>
    );
  };
}
