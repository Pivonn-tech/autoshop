'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Part {
  id: number;
  name: string;
  system: string;
  oem: string;
  price: number;
  stock: number;
  fitment: string;
  description: string;
}

export default function Parts() {
  const [selectedVehicle, setSelectedVehicle] = useState('All Vehicles');
  const [selectedSystem, setSelectedSystem] = useState('');
  const [parts, setParts] = useState<Part[]>([]);

  // Cyber/Sport Color Palette
  const colors = {
    background: '#0A0A0A',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    accent: '#FFD700',
    textSecondary: '#666666',
  };

  // Mock parts data
  const allParts: Part[] = [
    { id: 1, name: 'Brake Pads Premium', system: 'Braking', oem: 'BP-2024-01', price: 15000, stock: 12, fitment: 'Universal', description: 'High-performance ceramic brake pads' },
    { id: 2, name: 'Oil Filter Pro', system: 'Engine', oem: 'OF-2024-02', price: 3500, stock: 25, fitment: 'Universal', description: 'Premium synthetic oil filter' },
    { id: 3, name: 'Air Filter Ultra', system: 'Engine', oem: 'AF-2024-03', price: 4200, stock: 18, fitment: 'Universal', description: 'High-flow air intake filter' },
    { id: 4, name: 'Suspension Springs', system: 'Suspension', oem: 'SS-2024-04', price: 45000, stock: 8, fitment: 'Universal', description: 'Reinforced coil springs' },
    { id: 5, name: 'Battery 100Ah', system: 'Electrical', oem: 'BAT-2024-05', price: 28000, stock: 6, fitment: 'Universal', description: 'High-capacity automotive battery' },
    { id: 6, name: 'Alternator 120A', system: 'Electrical', oem: 'ALT-2024-06', price: 35000, stock: 5, fitment: 'Universal', description: 'Heavy-duty alternator' },
  ];

  useEffect(() => {
    // Filter parts based on system selection
    if (selectedSystem) {
      setParts(allParts.filter((p) => p.system === selectedSystem));
    } else {
      setParts(allParts);
    }
  }, [selectedSystem]);

  const systemCategories = ['Braking', 'Engine', 'Suspension', 'Electrical'];

  const formatKES = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div style={{ backgroundColor: colors.background, color: colors.text, minHeight: '100vh' }}>
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
          <Link href="/inventory" style={{ color: colors.text, textDecoration: 'none', cursor: 'pointer' }}>
            Inventory
          </Link>
          <Link href="/parts" style={{ color: colors.accent, textDecoration: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            Parts
          </Link>
          <Link href="/services" style={{ color: colors.text, textDecoration: 'none', cursor: 'pointer' }}>
            Services
          </Link>
        </div>
      </nav>

      {/* Garage Banner */}
      <div
        style={{
          backgroundColor: colors.surface,
          padding: '2rem',
          margin: '2rem',
          borderRadius: '2px',
          border: `2px solid ${colors.accent}`,
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '0.9rem', color: colors.textSecondary, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Currently Shopping For:
        </p>
        <p style={{ fontSize: '1.8rem', fontWeight: 900, color: colors.accent, marginBottom: '1rem' }}>
          {selectedVehicle}
        </p>
        <select
          value={selectedVehicle}
          onChange={(e) => setSelectedVehicle(e.target.value)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: colors.background,
            color: colors.text,
            border: `1px solid ${colors.accent}`,
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          <option>All Vehicles</option>
          <option>Melvin Red Cargo Truck</option>
          <option>Melvin Three-Wheeler Motorcycle</option>
          <option>Melvin Blue Motorcycle</option>
        </select>
      </div>

      {/* System Categories */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem 2rem',
        }}
      >
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>
          Parts by System
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '3rem',
          }}
        >
          <button
            onClick={() => setSelectedSystem('')}
            style={{
              backgroundColor: selectedSystem === '' ? colors.accent : colors.surface,
              color: selectedSystem === '' ? colors.background : colors.text,
              border: `2px solid ${colors.accent}`,
              padding: '1rem',
              borderRadius: '2px',
              fontWeight: 900,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (selectedSystem !== '') {
                e.currentTarget.style.backgroundColor = colors.accent;
                e.currentTarget.style.color = colors.background;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedSystem !== '') {
                e.currentTarget.style.backgroundColor = colors.surface;
                e.currentTarget.style.color = colors.text;
              }
            }}
          >
            All Parts
          </button>

          {systemCategories.map((system) => (
            <button
              key={system}
              onClick={() => setSelectedSystem(system)}
              style={{
                backgroundColor: selectedSystem === system ? colors.accent : colors.surface,
                color: selectedSystem === system ? colors.background : colors.text,
                border: `2px solid ${colors.accent}`,
                padding: '1rem',
                borderRadius: '2px',
                fontWeight: 900,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (selectedSystem !== system) {
                  e.currentTarget.style.backgroundColor = colors.accent;
                  e.currentTarget.style.color = colors.background;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedSystem !== system) {
                  e.currentTarget.style.backgroundColor = colors.surface;
                  e.currentTarget.style.color = colors.text;
                }
              }}
            >
              {system}
            </button>
          ))}
        </div>

        {/* Parts Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          {parts.map((part) => (
            <div
              key={part.id}
              style={{
                backgroundColor: colors.surface,
                padding: '1.5rem',
                borderRadius: '2px',
                border: `1px solid ${colors.accent}`,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(255, 215, 0, 0.15)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ color: colors.accent, fontWeight: 900, marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {part.system}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                {part.name}
              </h3>
              <p style={{ color: colors.textSecondary, marginBottom: '1rem', fontSize: '0.9rem' }}>
                {part.description}
              </p>
              <div style={{ borderTop: `1px solid ${colors.textSecondary}`, paddingTop: '1rem', marginBottom: '1rem' }}>
                <p style={{ color: colors.textSecondary, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  OEM: {part.oem}
                </p>
                <p style={{ color: colors.textSecondary, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  Stock: {part.stock} units
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 900, color: colors.accent }}>
                    {formatKES(part.price)}
                  </span>
                  <button
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.background,
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '2px',
                      fontWeight: 900,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: colors.background, borderRadius: '2px', textAlign: 'center', fontSize: '0.8rem', color: colors.accent, fontWeight: 900 }}>
                Guaranteed to Fit Your {selectedVehicle}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
