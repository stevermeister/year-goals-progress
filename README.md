# Year Goals Progress Tracker

A React-based visualization tool that helps track progress towards your yearly goals. Built with React and Vite.

## Features

- **Visual Progress Tracking**: Each goal is represented by a progress bar showing completion status
- **Year Progress Reference**: A red vertical line shows the current progress of the year itself, helping you stay on track
- **Flexible Goal Types**: Supports various types of goals:
  - Milestone-based goals (e.g., "Visit 2 new countries")
  - Numeric targets (e.g., "100 gym visits")
  - Rating-based goals (e.g., "Reach 2100 chess rating")

## How It Works

Each goal displays:
- Current progress vs target (e.g., "57/100")
- A purple progress bar showing completion percentage
- A red vertical line indicating year progress
  - If your goal progress is behind this line, you're falling behind schedule
  - If your goal progress is ahead of this line, you're ahead of schedule

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at http://localhost:3000

## Development

This project uses:
- React for UI components
- Vite for fast development and building
- CSS for styling and animations

## Contributing

Feel free to open issues and pull requests for any improvements you'd like to add.
