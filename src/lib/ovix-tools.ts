export const OVIX_TOOLS = [
  {
    type: 'function' as const,
    name: 'get_today_events',
    description: "Get today's calendar events with times and categories",
    parameters: { type: 'object', properties: {}, required: [] },
  },
  {
    type: 'function' as const,
    name: 'get_upcoming_events',
    description: 'Get the next N upcoming calendar events',
    parameters: {
      type: 'object',
      properties: { limit: { type: 'number', description: 'Number of events (default 5)' } },
      required: [],
    },
  },
  {
    type: 'function' as const,
    name: 'get_week_schedule',
    description: "Get this week's full schedule with all events",
    parameters: { type: 'object', properties: {}, required: [] },
  },
  {
    type: 'function' as const,
    name: 'get_weather',
    description: 'Get current weather in Toronto',
    parameters: { type: 'object', properties: {}, required: [] },
  },
  {
    type: 'function' as const,
    name: 'get_priorities',
    description: 'Get the current top 3 priorities for the day',
    parameters: { type: 'object', properties: {}, required: [] },
  },
  {
    type: 'function' as const,
    name: 'get_briefing',
    description: 'Get the latest daily briefing summary',
    parameters: { type: 'object', properties: {}, required: [] },
  },
  {
    type: 'function' as const,
    name: 'get_fitness_status',
    description: "Get fitness splits, this week's progress, and current streak",
    parameters: { type: 'object', properties: {}, required: [] },
  },
  {
    type: 'function' as const,
    name: 'get_ideas',
    description: 'Get ideas from the idea vault, optionally filtered by status',
    parameters: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['idea', 'exploring', 'building', 'shipped'] },
      },
      required: [],
    },
  },
  {
    type: 'function' as const,
    name: 'get_system_health',
    description: 'Get health status of all projects (Vercel, PostHog, GitHub, GSC)',
    parameters: { type: 'object', properties: {}, required: [] },
  },
  {
    type: 'function' as const,
    name: 'save_memory',
    description: 'Save something important to remember across conversations',
    parameters: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'What to remember' },
        category: { type: 'string', enum: ['correction', 'learning', 'preference', 'fact'] },
        scope: { type: 'string', enum: ['dev', 'prod', 'shared'], description: 'Default: shared' },
        importance: { type: 'number', description: '1-10 scale, default 5' },
      },
      required: ['content', 'category'],
    },
  },
  {
    type: 'function' as const,
    name: 'save_idea',
    description: 'Save a new idea to the idea vault',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        body: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
      },
      required: ['title'],
    },
  },
  {
    type: 'function' as const,
    name: 'log_workout',
    description: 'Log a completed workout for a specific split',
    parameters: {
      type: 'object',
      properties: {
        split_name: { type: 'string', description: 'Name of the fitness split' },
        notes: { type: 'string' },
      },
      required: ['split_name'],
    },
  },
];
