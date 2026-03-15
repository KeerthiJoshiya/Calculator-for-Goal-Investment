'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, User, Bot, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const KNOWLEDGE_BASE: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['sip'],
    answer: 'A Systematic Investment Plan (SIP) is a method of investing a fixed amount regularly in an investment product such as a mutual fund. Instead of investing a large lump sum, SIP allows smaller periodic investments, typically monthly. This helps investors build disciplined investing habits and allows investments to benefit from compounding over time.'
  },
  {
    keywords: ['inflation rate'],
    answer: 'The inflation rate represents the percentage increase in prices over a specific period, usually annually. It helps estimate how the cost of a financial goal may increase over time.'
  },
  {
    keywords: ['inflation'],
    answer: 'Inflation refers to the gradual increase in prices of goods and services over time. As inflation increases, the purchasing power of money decreases, meaning a financial goal that costs a certain amount today may cost more in the future.'
  },
  {
    keywords: ['expected return'],
    answer: 'Expected return is the assumed annual rate at which an investment may grow. It is used for educational calculations in financial planning. Actual market returns may vary.'
  },
  {
    keywords: ['future cost'],
    answer: 'The future cost of a goal is calculated using the formula:\n\nFuture Value = Present Cost × (1 + Inflation Rate)^Years\n\nThis estimates how much a financial goal may cost in the future.'
  },
  {
    keywords: ['stop sip'],
    answer: 'If SIP contributions stop temporarily, the total invested amount decreases and the final accumulated corpus may become lower than expected. Regular investing helps maintain steady growth.'
  },
  {
    keywords: ['duration'],
    answer: 'Increasing the investment duration allows investments to grow for a longer period through compounding, which may reduce the required monthly investment.'
  },
  {
    keywords: ['compounding'],
    answer: 'Compounding means that investment returns start generating additional returns over time. Over long investment periods, compounding can significantly increase the value of investments.'
  },
  {
    keywords: ['long term'],
    answer: 'Long-term investments may benefit from compounding and can help reduce the impact of short-term market fluctuations.'
  },
  {
    keywords: ['exact returns', 'predict'],
    answer: 'This calculator provides illustrative estimates based on user assumptions such as inflation and expected return. Actual results may vary depending on market conditions.'
  }
];

const DEFAULT_RESPONSE = "This assistant provides educational information about SIP, inflation, and goal-based investment planning used in this calculator. Try asking questions such as: What is SIP, What is inflation, Why does inflation matter, How does compounding work, What happens if I stop SIP for two years";

export function StaticChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Welcome! I am your Educational Assistant. How can I help you understand financial goal planning today?' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      const lowerInput = userMsg.toLowerCase();
      let botResponse = DEFAULT_RESPONSE;
      
      // Find the best match from the knowledge base
      // Sort by keyword length descending to match more specific phrases first (e.g. "inflation rate" before "inflation")
      const matchedItem = KNOWLEDGE_BASE.slice().sort((a, b) => {
        const maxA = Math.max(...a.keywords.map(k => k.length));
        const maxB = Math.max(...b.keywords.map(k => k.length));
        return maxB - maxA;
      }).find(item => item.keywords.some(kw => lowerInput.includes(kw)));

      if (matchedItem) {
        botResponse = matchedItem.answer;
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-body">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-transform active:scale-90"
          aria-label="Open Educational Assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-[320px] md:w-[380px] h-[500px] flex flex-col shadow-2xl border-primary/20 rounded-xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          <CardHeader className="bg-primary text-primary-foreground flex flex-row items-center justify-between p-4">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Educational Assistant – Prototype Mode
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)} 
              className="text-white hover:bg-white/10 h-8 w-8"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          
          <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 scroll-smooth">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-2",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                  msg.role === 'user' ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                )}>
                  {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                </div>
                <div
                  className={cn(
                    "max-w-[85%] rounded-lg p-3 text-[11px] md:text-xs leading-relaxed whitespace-pre-wrap",
                    msg.role === 'user' 
                      ? "bg-accent text-accent-foreground rounded-tr-none" 
                      : "bg-white text-foreground border border-border shadow-sm rounded-tl-none"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </CardContent>

          <CardFooter className="p-3 border-t bg-background">
            <div className="flex w-full gap-2">
              <Input
                placeholder="Ask about SIP, inflation, etc."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="text-xs h-10 border-primary/20 focus-visible:ring-primary"
              />
              <Button size="icon" onClick={handleSend} className="h-10 w-10 shrink-0 bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
