'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const colors = {
  background: '#0A0A0A',
  surface: '#1A1A1A',
  text: '#FFFFFF',
  accent: '#FFD700',
  textSecondary: '#666666',
};

interface ServiceRecord {
  id: string;
  date: string;
  service: string;
  cost: number;
  nextDue: string;
  mileage: number;
}

export default function ServiceHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push(`/auth/login?callbackUrl=/service-history`);
      return;
    }

    setIsLoading(false);
  }, [status, router]);

  if (isLoading || !session) {
    return (
      <div
        style={{
          backgroundColor: colors.background,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.text,
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  // Mock service history data
  const serviceHistory: ServiceRecord[] = [
    {
      id: 'SVC001',
      date: '2024-05-15',
      service: 'Oil Change',
      cost: 3500,
      nextDue: '2024-08-15',
      mileage: 45230,
    },
    {
      id: 'SVC002',
      date: '2024-03-20',
      service: 'Brake Service',
      cost: 8500,
      nextDue: '2025-03-20',
      mileage: 44100,
    },
    {
      id: 'SVC003',
      date: '2024-01-10',
      service: 'Engine Diagnostics',
      cost: 2500,
      nextDue: '2025-01-10',
      mileage: 42500,
    },
    {
      id: 'SVC004',
      date: '2023-11-05',
      service: 'AC Service',
      cost: 4500,
      nextDue: '2024-11-05',
      mileage: 41200,
    },
  ];

  const formatKES = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', color: colors.text }}>
      {/* Navigation */}
      <nav
        style={{
          backgroundColor: colors.surface,
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: `0 4px 6px rgba(0,0,0,0.3)`,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.accent, cursor: 'pointer' }}>
            AUTOFIX KENYA
          </div>
        </Link>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="/my-garage" style={{ color: colors.text, textDecoration: 'none', cursor: 'pointer' }}>
            My Garage
          </Link>
          <Link href="/inventory" style={{ color: colors.text, textDecoration: 'none', cursor: 'pointer' }}>
            Inventory
          </Link>
          <Link href="/parts" style={{ color: colors.text, textDecoration: 'none', cursor: 'pointer' }}>
            Parts
          </Link>
          <Link href="/services" style={{ color: colors.text, textDecoration: 'none', cursor: 'pointer' }}>
            Services
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Service History</h1>
        <p style={{ color: colors.textSecondary, marginBottom: '2rem' }}>
          Track all maintenance and service records for your vehicles
        </p>

        {serviceHistory.length === 0 ? (
          <div
            style={{
              backgroundColor: colors.surface,
              borderRadius: '0.5rem',
              padding: '2rem',
              textAlign: 'center',
              color: colors.textSecondary,
            }}
          >
            <p>No service history found. Book a service to get started!</p>
            <Link href="/services" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: colors.accent,
                  color: colors.background,
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Book a Service
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {serviceHistory.map((record) => (
              <div
                key={record.id}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  borderLeft: `4px solid ${colors.accent}`,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                }}
              >
                <div>
                  <p style={{ color: colors.textSecondary, fontSize: '0.875rem', margin: 0 }}>Service ID</p>
                  <p style={{ color: colors.accent, fontWeight: 'bold', margin: '0.25rem 0 0 0' }}>{record.id}</p>
                </div>
                <div>
                  <p style={{ color: colors.textSecondary, fontSize: '0.875rem', margin: 0 }}>Date</p>
                  <p style={{ color: colors.text, fontWeight: '600', margin: '0.25rem 0 0 0' }}>
                    {formatDate(record.date)}
                  </p>
                </div>
                <div>
                  <p style={{ color: colors.textSecondary, fontSize: '0.875rem', margin: 0 }}>Service Type</p>
                  <p style={{ color: colors.text, fontWeight: '600', margin: '0.25rem 0 0 0' }}>{record.service}</p>
                </div>
                <div>
                  <p style={{ color: colors.textSecondary, fontSize: '0.875rem', margin: 0 }}>Cost</p>
                  <p style={{ color: colors.accent, fontWeight: 'bold', margin: '0.25rem 0 0 0' }}>
                    {formatKES(record.cost)}
                  </p>
                </div>
                <div>
                  <p style={{ color: colors.textSecondary, fontSize: '0.875rem', margin: 0 }}>Mileage</p>
                  <p style={{ color: colors.text, fontWeight: '600', margin: '0.25rem 0 0 0' }}>{record.mileage.toLocaleString()} km</p>
                </div>
                <div>
                  <p style={{ color: colors.textSecondary, fontSize: '0.875rem', margin: 0 }}>Next Due</p>
                  <p style={{ color: colors.accent, fontWeight: '600', margin: '0.25rem 0 0 0' }}>
                    {formatDate(record.nextDue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div style={{ marginTop: '2rem' }}>
          <Link href="/my-garage" style={{ textDecoration: 'none' }}>
            <button
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: colors.surface,
                border: `1px solid ${colors.accent}`,
                borderRadius: '0.5rem',
                color: colors.accent,
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.accent;
                e.currentTarget.style.color = colors.background;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.surface;
                e.currentTarget.style.color = colors.accent;
              }}
            >
              ← Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
