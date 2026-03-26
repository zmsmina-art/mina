const TIMEZONE = 'America/Toronto';

function localizeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    timeZone: TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    timeZone: TIMEZONE,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(): string {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

interface ContextData {
  calendar?: { title: string; startTime: string | Date; endTime: string | Date; category: string }[];
  weather?: { tempC: string; description: string; highC: string; lowC: string; summary: string } | null;
  priorities?: { content: string } | null;
  briefing?: { content: string } | null;
  fitness?: { splits: string[]; weekProgress: number; streak: number };
  ideas?: { title: string; status: string }[];
  health?: { content: string } | null;
  memories?: { content: string; category: string; scope: string }[];
}

export function buildSystemPrompt(mode: 'dev' | 'prod' | 'assistant', context: ContextData): string {
  const sections: string[] = [];

  // Identity
  sections.push(`You are Ovix — Mina's AI collaborator. You're direct, strategic, and efficient. No fluff, no filler. You know Mina's world: Olunix/Vantage (SaaS brand audit platform, $30/month), Solnix (community platform), his personal portfolio, and his life as a student-founder balancing school, business, fitness, and personal life.

You're in a voice conversation. Keep responses conversational and concise — prefer short answers. If Mina wants more detail, he'll ask. Never read out lists unless asked. Summarize instead.`);

  // Mode
  const modeDesc = {
    dev: 'Technical collaborator — code architecture, debugging strategy, system design, implementation planning.',
    prod: 'Brand strategist — messaging, positioning, go-to-market, content strategy, competitive analysis.',
    assistant: 'Personal operations — schedule, priorities, fitness, ideas, general planning, life management.',
  };
  sections.push(`Current mode: ${mode.toUpperCase()}\n${modeDesc[mode]}`);

  // Time context
  sections.push(`Current date: ${formatDate()}\nCurrent time: ${formatTime()}`);

  // Calendar
  if (context.calendar?.length) {
    const events = context.calendar
      .map(e => `- ${localizeTime(e.startTime)}: ${e.title} [${e.category}]`)
      .join('\n');
    sections.push(`Today's schedule:\n${events}`);
  }

  // Weather
  if (context.weather) {
    sections.push(`Weather: ${context.weather.summary || `${context.weather.tempC}°C, ${context.weather.description}`}`);
  }

  // Priorities
  if (context.priorities?.content) {
    sections.push(`Today's priorities:\n${context.priorities.content}`);
  }

  // Briefing
  if (context.briefing?.content) {
    sections.push(`Latest briefing:\n${context.briefing.content}`);
  }

  // Fitness
  if (context.fitness) {
    sections.push(`Fitness: ${context.fitness.weekProgress} workouts this week | ${context.fitness.streak}-week streak | Splits: ${context.fitness.splits.join(', ')}`);
  }

  // Ideas summary
  if (context.ideas?.length) {
    const byStatus: Record<string, number> = {};
    for (const idea of context.ideas) {
      byStatus[idea.status] = (byStatus[idea.status] || 0) + 1;
    }
    const summary = Object.entries(byStatus).map(([s, c]) => `${c} ${s}`).join(', ');
    sections.push(`Ideas vault: ${context.ideas.length} total (${summary})`);
  }

  // System health
  if (context.health?.content) {
    sections.push(`System health:\n${context.health.content}`);
  }

  // Memories
  if (context.memories?.length) {
    const memLines = context.memories.map(m => `- [${m.category}] ${m.content}`).join('\n');
    sections.push(`Your memories (apply silently, don't read aloud unless asked):\n${memLines}`);
  }

  // Rules
  sections.push(`Rules:
1. Never read memories aloud unless asked.
2. If a tool call fails, acknowledge briefly and move on.
3. Keep responses conversational — you're in a voice call.
4. Prefer short responses. Mina will ask for more if needed.
5. When saving a memory, confirm briefly: "Got it, I'll remember that."
6. Use tools to get fresh data rather than relying on the context above when it might be stale.`);

  return sections.join('\n\n');
}
