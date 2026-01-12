import { Suspense } from 'react';
import TransferClient from './TransferClient';

export default function TransferPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="rounded-lg border p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </main>
      }
    >
      <TransferClient />
    </Suspense>
  );
}
