import { useEffect, useState } from 'react';

export interface MaintenanceState {
  enabled: boolean;
  reason?: string;
  estimatedTime?: string;
  contact?: string;
}

export function useMaintenance() {
  const [maintenance, setMaintenance] = useState<MaintenanceState>({ enabled: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        // Try to call any API endpoint to check if maintenance is active
        const response = await fetch('/api/health', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 503) {
          const data = await response.json();
          setMaintenance({
            enabled: true,
            reason: data.reason,
            estimatedTime: data.estimatedTime,
            contact: data.contact
          });
        } else {
          setMaintenance({ enabled: false });
        }
      } catch (error) {
        console.warn('Maintenance check failed:', error);
        // On connection error, assume site is down (safe default)
        setMaintenance({ enabled: false });
      } finally {
        setLoading(false);
      }
    };

    checkMaintenance();
    // Re-check every 30 seconds
    const interval = setInterval(checkMaintenance, 30000);

    return () => clearInterval(interval);
  }, []);

  return { maintenance, loading };
}
