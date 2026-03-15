'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Info,
  BarChart3,
  LineChart,
  BookOpen,
  Settings2,
  TrendingUp,
  Scale,
  Clock
} from 'lucide-react';
import { 
  calculateFutureGoalCost, 
  calculateMonthlySIP, 
  generateGrowthSimulation, 
  formatCurrency 
} from '@/lib/investment-utils';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { StaticChatbot } from '@/components/StaticChatbot';

export default function CalculatorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const goalName = searchParams.get('goal') || 'Investment Goal';

  // State for user-editable assumptions
  const [goalCost, setGoalCost] = useState(500000);
  const [years, setYears] = useState(10);
  const [inflation, setInflation] = useState(6);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [adjustForInflation, setAdjustForInflation] = useState(true);

  // Financial calculations using Official Hackathon Formulas
  const stats = useMemo(() => {
    const fv = calculateFutureGoalCost(goalCost, inflation / 100, years, adjustForInflation);
    const sip = calculateMonthlySIP(fv, expectedReturn / 100, years);
    const totalInvested = sip * years * 12;
    const totalReturns = fv - totalInvested;
    const growthData = generateGrowthSimulation(sip, expectedReturn / 100, years);

    return { fv, sip, totalInvested, totalReturns, growthData };
  }, [goalCost, inflation, years, expectedReturn, adjustForInflation]);

  // Investment Breakdown Data (Invested vs Final Corpus)
  const breakdownData = [
    { name: 'Total Invested', amount: stats.totalInvested, fill: 'hsl(var(--muted-foreground))' },
    { name: 'Final Corpus', amount: stats.fv, fill: 'hsl(var(--primary))' },
  ];

  // What-If Durations (Simplified Comparison)
  const whatIfDurations = [10, 15, 20];
  const whatIfScenarios = whatIfDurations.map(y => {
    const fv = calculateFutureGoalCost(goalCost, inflation / 100, y, adjustForInflation);
    return {
      years: y,
      sip: calculateMonthlySIP(fv, expectedReturn / 100, y)
    };
  });

  return (
    <div className="min-h-screen bg-background pb-20 font-body">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push('/')} 
              className="rounded-full"
              aria-label="Back to Goal Selection"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold font-headline text-primary">
              {goalName} Planner
            </h1>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border px-3 py-1 rounded">
            Investor Education Mode
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* 1. Goal Summary Panel */}
        <Card className="border-2 border-primary/20 bg-primary/5 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold uppercase tracking-wide flex items-center gap-2 font-headline">
              <Scale className="w-5 h-5 text-primary" />
              Goal Summary Panel
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 bg-background rounded-lg border shadow-sm">
              <span className="text-xs font-bold text-muted-foreground uppercase block mb-1">Required Monthly SIP</span>
              <p className="text-3xl font-bold text-primary font-headline">{formatCurrency(stats.sip)}</p>
            </div>
            <div className="p-5 bg-background rounded-lg border shadow-sm">
              <span className="text-xs font-bold text-muted-foreground uppercase block mb-1">Total Investment</span>
              <p className="text-2xl font-bold font-headline">{formatCurrency(stats.totalInvested)}</p>
            </div>
            <div className="p-5 bg-background rounded-lg border shadow-sm">
              <span className="text-xs font-bold text-muted-foreground uppercase block mb-1">Future Goal Value</span>
              <p className="text-2xl font-bold font-headline">{formatCurrency(stats.fv)}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar: Editable Assumptions */}
          <aside className="lg:col-span-4 space-y-6">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg gap-2 font-headline">
                  <Settings2 className="w-5 h-5 text-primary" />
                  Edit Assumptions
                </CardTitle>
                <CardDescription>Adjust variables to understand their impact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Inflation Toggle */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label htmlFor="inflation-toggle" className="text-sm font-bold">Adjust for Inflation</Label>
                    <p className="text-[10px] text-muted-foreground">Toggle to see current vs future cost impact</p>
                  </div>
                  <Switch 
                    id="inflation-toggle" 
                    checked={adjustForInflation} 
                    onCheckedChange={setAdjustForInflation} 
                  />
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Current Cost of Goal</label>
                      <span className="text-sm font-bold text-primary">{formatCurrency(goalCost)}</span>
                    </div>
                    <Slider 
                      value={[goalCost]} 
                      min={10000} 
                      max={5000000} 
                      step={10000} 
                      onValueChange={([v]) => setGoalCost(v)} 
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Years to Goal</label>
                      <span className="text-sm font-bold text-primary">{years} Years</span>
                    </div>
                    <Slider 
                      value={[years]} 
                      min={1} 
                      max={40} 
                      step={1} 
                      onValueChange={([v]) => setYears(v)} 
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Inflation Rate (%)</label>
                      <span className="text-sm font-bold text-primary">{inflation}%</span>
                    </div>
                    <Slider 
                      value={[inflation]} 
                      min={0} 
                      max={15} 
                      step={0.5} 
                      onValueChange={([v]) => setInflation(v)} 
                      disabled={!adjustForInflation}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Expected Annual Return (%)</label>
                      <span className="text-sm font-bold text-accent">{expectedReturn}%</span>
                    </div>
                    <Slider 
                      value={[expectedReturn]} 
                      min={1} 
                      max={30} 
                      step={0.5} 
                      onValueChange={([v]) => setExpectedReturn(v)} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4. Assumptions Transparency Panel */}
            <Card className="border-l-4 border-l-primary shadow-sm bg-primary/5">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-tight flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Assumptions Transparency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Inflation Rate</span>
                    <p className="font-bold">{inflation}%</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Expected Return</span>
                    <p className="font-bold">{expectedReturn}%</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Duration</span>
                    <p className="font-bold">{years} Years</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Calculation Method</span>
                    <p className="font-bold italic">Annuity Due</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content: Visualizations & Insights */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 2. Investment Growth Line Chart */}
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg gap-2 font-headline">
                  <LineChart className="w-5 h-5 text-primary" />
                  Investment Growth Projection
                </CardTitle>
                <CardDescription>Illustrative wealth accumulation over {years} years</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ChartContainer config={{
                    value: { label: 'Final Corpus', color: 'hsl(var(--primary))' },
                    invested: { label: 'Amount Invested', color: 'hsl(var(--muted-foreground))' }
                  }} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.growthData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="year" tickFormatter={(v) => `${v}Y`} fontSize={11} />
                        <YAxis tickFormatter={(v) => `₹${v/100000}L`} fontSize={11} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} strokeWidth={2} />
                        <Area type="monotone" dataKey="invested" stroke="hsl(var(--muted-foreground))" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 3. Investment Breakdown Bar Chart */}
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Investment Breakdown
                  </CardTitle>
                  <CardDescription>Invested vs. Final Corpus</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    <ChartContainer config={{
                      amount: { label: 'Amount', color: 'hsl(var(--primary))' }
                    }} className="h-full w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={breakdownData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" fontSize={11} width={100} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={40}>
                            {breakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Simplified What-If Scenario Explorer */}
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    What-If Duration Explorer
                  </CardTitle>
                  <CardDescription>Impact of time on monthly SIP</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 py-2">
                    {whatIfScenarios.map((scenario) => (
                      <div key={scenario.years} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold uppercase text-muted-foreground">{scenario.years} Years</span>
                          <span className="text-[10px] text-muted-foreground italic">Target Duration</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-primary">{formatCurrency(scenario.sip)}</span>
                          <span className="block text-[10px] text-muted-foreground">Monthly SIP</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 5. Simplified Financial Insight Section */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 font-headline">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Financial Insight
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed space-y-4">
                <div className="flex gap-4 items-start p-4 bg-background rounded-lg border shadow-sm">
                  <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p>
                    <strong>Impact of Time:</strong> A longer investment duration allows investments to grow through compounding and may reduce the required monthly SIP.
                  </p>
                </div>
                <div className="flex gap-4 items-start p-4 bg-background rounded-lg border shadow-sm">
                  <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p>
                    <strong>Inflation Awareness:</strong> Inflation increases the future cost of financial goals, which is why planning should consider future values rather than current prices.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 7. Mandatory Disclaimer */}
        <footer className="mt-16 p-8 bg-muted rounded-lg border-l-4 border-l-accent">
          <p className="text-xs leading-relaxed text-foreground text-center italic">
            This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. 
            Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. 
            Past performance may or may not be sustained in future and is not a guarantee of any future returns.
          </p>
        </footer>
      </main>

      {/* 6. Educational Chatbot */}
      <StaticChatbot />
    </div>
  );
}
