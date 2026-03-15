'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  GraduationCap, 
  Home, 
  Car, 
  Plane, 
  Heart, 
  PlusCircle,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StaticChatbot } from '@/components/StaticChatbot';

const GOALS = [
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'house', label: 'Buy a House', icon: Home },
  { id: 'car', label: 'Buy a Car', icon: Car },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'wedding', label: 'Wedding', icon: Heart },
];

export default function GoalSelectionPage() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [customGoal, setCustomGoal] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
    setIsCustomMode(false);
  };

  const handleContinue = () => {
    const goalName = isCustomMode ? customGoal : GOALS.find(g => g.id === selectedGoal)?.label || 'My Goal';
    if (!goalName) return;
    router.push(`/calculator?goal=${encodeURIComponent(goalName)}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-4xl w-full space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary font-headline">
            Plan Your Financial Goal
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            Professional investor education tool designed for the FinCal Innovation Hackathon.
          </p>
        </header>

        <section 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" 
          aria-label="Goal Selection"
        >
          {GOALS.map((goal) => {
            const Icon = goal.icon;
            return (
              <Card
                key={goal.id}
                tabIndex={0}
                role="button"
                aria-pressed={selectedGoal === goal.id}
                className={cn(
                  "cursor-pointer transition-all duration-300 border-2 hover:border-primary hover:shadow-lg",
                  selectedGoal === goal.id ? "border-primary bg-primary/5 shadow-md scale-[1.02]" : "border-border bg-card"
                )}
                onClick={() => handleGoalSelect(goal.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleGoalSelect(goal.id)}
              >
                <CardContent className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
                  <div className="p-3 rounded-full bg-secondary text-primary">
                    <Icon className="w-8 h-8" />
                  </div>
                  <span className="text-md font-semibold font-body">{goal.label}</span>
                </CardContent>
              </Card>
            );
          })}

          <Card
            tabIndex={0}
            role="button"
            aria-pressed={isCustomMode}
            className={cn(
              "cursor-pointer transition-all duration-300 border-2 hover:border-primary hover:shadow-lg",
              isCustomMode ? "border-primary bg-primary/5 shadow-md scale-[1.02]" : "border-border bg-card"
            )}
            onClick={() => {
              setIsCustomMode(true);
              setSelectedGoal(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && (setIsCustomMode(true), setSelectedGoal(null))}
          >
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
              <div className="p-3 rounded-full bg-secondary text-primary">
                <PlusCircle className="w-8 h-8" />
              </div>
              <span className="text-md font-semibold font-body">Custom Goal</span>
            </CardContent>
          </Card>
        </section>

        {isCustomMode && (
          <div className="max-w-md mx-auto space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <label htmlFor="custom-goal" className="block text-sm font-medium text-center">Enter Custom Goal Name</label>
            <Input
              id="custom-goal"
              placeholder="e.g., Retirement Fund"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              className="text-lg h-12 rounded-lg border-2 text-center"
              onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
              autoFocus
            />
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            disabled={!selectedGoal && (!isCustomMode || !customGoal)}
            onClick={handleContinue}
            className="h-14 px-10 text-lg font-bold bg-primary hover:bg-primary/90 transition-all active:scale-95"
          >
            Continue to Calculator
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      <footer className="mt-24 text-center text-sm text-muted-foreground border-t pt-8 w-full max-w-4xl font-body">
        <p className="font-semibold text-primary">FinCal Innovation Hackathon Prototype</p>
        <p className="mt-2">Educational tool designed for transparency and accessibility.</p>
      </footer>

      <StaticChatbot />
    </div>
  );
}