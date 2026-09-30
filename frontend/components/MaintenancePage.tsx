'use client';

import { useEffect, useState } from 'react';

interface MaintenanceData {
  reason?: string;
  estimatedTime?: string;
  contact?: string;
}

export default function MaintenancePage() {
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceData>({
    reason: 'Site maintenance in progress',
    estimatedTime: '30 minutes',
    contact: 'support@autoshop.com'
  });

  useEffect(() => {
    // Try to fetch maintenance data from API
    const checkMaintenance = async () => {
      try {
        const response = await fetch('/api/maintenance-status', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.status === 503) {
          const data = await response.json();
          setMaintenanceData({
            reason: data.reason || maintenanceData.reason,
            estimatedTime: data.estimatedTime || maintenanceData.estimatedTime,
            contact: data.contact || maintenanceData.contact
          });
        }
      } catch (error) {
        console.warn('Could not fetch maintenance data:', error);
        // Use default data if fetch fails
      }
    };

    checkMaintenance();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md w-full text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30 mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AutoShop</h1>
          <p className="text-slate-400">Professional Auto Solutions</p>
        </div>

        {/* Main Message */}
        <div className="mb-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-500/20 mb-6">
            <svg
              className="w-7 h-7 text-orange-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5h.01v.01H12v-.01z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">
            We&apos;ll Be Right Back
          </h2>
          <p className="text-slate-300 mb-6">
            {maintenanceData.reason || 'We are currently performing scheduled maintenance to improve your experience.'}
          </p>

          {/* Details */}
          <div className="space-y-4 text-sm">
            {maintenanceData.estimatedTime && (
              <div className="flex items-center justify-center text-slate-400">
                <svg
                  className="w-4 h-4 mr-2 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Estimated time: <span className="ml-1 text-slate-200">{maintenanceData.estimatedTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        {maintenanceData.contact && (
          <div className="mb-8">
            <p className="text-slate-400 text-sm mb-2">Questions or concerns?</p>
            <a
              href={`mailto:${maintenanceData.contact}`}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact Us
            </a>
          </div>
        )}

        {/* Footer Text */}
        <p className="text-xs text-slate-500">
          Thanks for your patience while we improve our platform
        </p>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
