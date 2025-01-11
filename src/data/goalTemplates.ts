export interface GoalTemplate {
  title: string;
  start: number;
  goal: number;
  emoji: string;
}

export const goalTemplates: GoalTemplate[] = [
  { title: "Read 12 books", start: 0, goal: 12, emoji: "📚" },
  { title: "Run 100 times", start: 0, goal: 100, emoji: "🏃" },
  { title: "Do 50 workout sessions", start: 0, goal: 50, emoji: "💪" },
  { title: "Save €10000", start: 0, goal: 10000, emoji: "💰" },
  { title: "Write 100 journal entries", start: 0, goal: 100, emoji: "📝" },
  { title: "Try 20 new healthy recipes", start: 0, goal: 20, emoji: "🥗" },
  { title: "Meditate 100 times", start: 0, goal: 100, emoji: "🧘" },
  { title: "Attend 10 professional events", start: 0, goal: 10, emoji: "🎯" },
  { title: "Take 200 daily walks", start: 0, goal: 200, emoji: "🚶" },
  { title: "Publish 12 blog posts", start: 0, goal: 12, emoji: "✍️" },
  { title: "Watch 30 educational videos", start: 0, goal: 30, emoji: "🎓" },
  { title: "Declutter 12 spaces at home", start: 0, goal: 12, emoji: "🧹" },
  { title: "Avoid sugar for 100 days", start: 0, goal: 100, emoji: "🍬" },
  { title: "Spend 50 days completely offline for an hour", start: 0, goal: 50, emoji: "📵" },
  { title: "Learn 50 new words in a foreign language", start: 0, goal: 50, emoji: "🗣️" }
];
