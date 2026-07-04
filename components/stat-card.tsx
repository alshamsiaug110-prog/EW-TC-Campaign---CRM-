interface StatCardProps {
  label: string;
  value: number | string;
  color: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, color, icon }: StatCardProps) {
  return (
    <div style={{
      background: '#141720',
      border: `1px solid ${color}33`,
      borderRadius: 10,
      padding: '14px 16px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: 11, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        {icon}
        <div style={{ fontSize: 24, fontWeight: 700, color }}>
          {value}
        </div>
      </div>
    </div>
  );
}
