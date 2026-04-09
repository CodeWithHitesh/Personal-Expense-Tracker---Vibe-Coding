import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts";
import { Transaction, Category } from "../types";

interface StatsRadarProps {
  transactions: Transaction[];
  currency: string;
}

const EXPENSE_CATEGORIES: Category[] = [
  'Food', 
  'Transport', 
  'Entertainment', 
  'Bills', 
  'Shopping', 
  'Health',
  'Other'
];

export function StatsRadar({ transactions, currency }: StatsRadarProps) {
  const expenses = transactions.filter(t => t.type === 'expense');
  
  // Initialize only expense categories
  const dataMap = EXPENSE_CATEGORIES.reduce((acc, curr) => {
    acc[curr] = 0;
    return acc;
  }, {} as Record<string, number>);

  // Add actual expenses
  expenses.forEach(curr => {
    if (dataMap[curr.category] !== undefined) {
      dataMap[curr.category] += curr.amount;
    }
  });

  const maxDamage = Math.max(...Object.values(dataMap));
  
  // Subtle base value to keep the shape even with 0s, but much smaller
  const baseValue = (maxDamage > 0 ? maxDamage : 100) * 0.05;

  const data = EXPENSE_CATEGORIES.map(cat => ({
    subject: cat,
    A: Math.max(dataMap[cat], baseValue),
    actual: dataMap[cat]
  }));

  return (
    <div className="bg-rpg-panel pixel-border p-4 h-full min-h-[300px] flex flex-col relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute inset-0 bg-radial-gradient from-rpg-damage/5 to-transparent pointer-events-none" />
      
      <h3 className="font-pixel text-sm text-rpg-damage mb-2 flex items-center gap-2">
        <span className="w-2 h-2 bg-rpg-damage animate-pulse" /> DAMAGE PROFILE
      </h3>
      
      <div className="flex-1 w-full min-h-[250px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 600 }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 'auto']} 
              tick={false} 
              axisLine={false} 
            />
            <Radar
              name="Damage"
              dataKey="A"
              stroke="#ef4444"
              strokeWidth={2}
              fill="#ef4444"
              fillOpacity={0.4}
              animationBegin={0}
              animationDuration={1500}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                borderColor: '#ef4444', 
                fontFamily: 'JetBrains Mono',
                borderRadius: '0px',
                borderWidth: '2px'
              }}
              itemStyle={{ color: '#ef4444' }}
              formatter={(value: any, name: string, props: any) => [`${currency}${props.payload.actual.toFixed(2)}`, 'Damage Taken']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-[10px] font-mono text-slate-500 text-center uppercase tracking-widest">
        Elemental Vulnerabilities
      </div>
    </div>
  );
}
