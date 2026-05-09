# FocusFlow

FocusFlow is a React Native habit tracker and productivity app built with Expo Router and Zustand. It helps users create daily habits, track check-ins, maintain streaks, and stay focused with a built-in Pomodoro-style timer.

## 🚀 Overview

FocusFlow is designed for people who want a simple, visually pleasing mobile productivity app:

- Track daily habits with quick check-ins
- See streak progress and habit completion progress bars
- Add new habits with customizable icons and colors
- Use a built-in focus timer with break mode
- Manage daily reminder settings with mock notification support in Expo Go
- Persist habit data locally using AsyncStorage

## 📱 App Structure

The app uses `expo-router` and includes a tabbed navigation layout:

- `Habits` - main habit dashboard with seeded starter habits and habit cards
- `Timer` - Pomodoro-style timer with focus/break states and haptics
- `Settings` - daily reminder toggle, scheduled time controls, and test notification support
- `Add Habit` - modal screen to create a new habit with icon and color selection

## ✨ Key Features

- Habit creation with custom icon and color
- Daily check-in toggle per habit
- Streak calculation based on consecutive daily check-ins
- Progress tracking toward a default target of 7 days
- Local persistence using `@react-native-async-storage/async-storage`
- Expo mock notification support for reminder settings
- Expo Haptics feedback for improves interaction
- Responsive tab bar with safe-area styling

## 🧠 Technology Stack

- Expo SDK `~54.0.33`
- React Native `0.81.5`
- Expo Router `~6.0.23`
- Zustand state management
- Async Storage persistence
- Expo Notifications (mock implementation in Expo Go)
- Expo Haptics and Expo Keep Awake
- TypeScript

## 📁 Important Files

- `app/_layout.tsx` - root navigation and status bar setup
- `app/(tabs)/_layout.tsx` - bottom tab navigator configuration
- `app/(tabs)/index.tsx` - habit dashboard screen
- `app/(tabs)/timer.tsx` - focus timer screen
- `app/(tabs)/settings.tsx` - settings and reminder controls
- `app/habit/add.tsx` - add habit modal screen
- `src/components/HabitCard.tsx` - habit card UI and interactions
- `src/store/useStore.ts` - Zustand store logic and persistence
- `src/utils/dates.ts` - date helpers and streak calculation
- `src/utils/notifications.ts` - mock notification helpers for Expo Go

## ⚙️ Setup

1. Install dependencies:

```bash
npm install
```

2. Start the Expo development server:

```bash
npm run start
```

3. Run on Android:

```bash
npm run android
```

4. Run on iOS:

```bash
npm run ios
```

5. Run on web:

```bash
npm run web
```

## 💡 Notes

- The notification implementation in `src/utils/notifications.ts` is currently a mock version for Expo Go. In a native development build, this can be replaced with real `expo-notifications` scheduling logic.
- Habit data is persisted in local storage under the key `focusflow-store`.
- The app seeds starter habits automatically when the app first opens.

## 🧪 Customization Ideas

- Add habit editing and target-day customization
- Implement actual local push notifications for reminders
- Add analytics or streak history charts
- Support dark/light theme switching beyond the current mock theme state
- Add habit categories, reminders per habit, or weekly review summaries

## 📌 License

This project is currently private.
