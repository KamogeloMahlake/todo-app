
# Todo App

A simple Todo application built with JavaScript, using modular scripts and custom styles.

## Features

- Clean and organized project structure with separation of styles, scripts, and main entry point.
- Main entry point (`src/index.js`) imports styles and initializes the application logic.
- Script modules (in the `src/scripts` folder) handle the core functionality of the app.

## Project Structure

```
src/
  ├── index.js           # App entry point; imports main stylesheet and scripts
  ├── styles/
  │     └── style.css    # Application styling
  └── scripts/
        └── appDOM.js    # Handles DOM interactions and app logic
```

## Getting Started

1. Clone the repository:
   ```sh
   git clone https://github.com/KamogeloMahlake/todo-app.git
   cd todo-app
   ```

2. Open `index.html` in your browser to view the app.

## Scripts

- All main logic is in the `src/scripts/appDOM.js` file.
- You can extend functionality by adding more scripts to the `src/scripts` folder.

## Styling

- Custom CSS is in `src/styles/style.css`.
