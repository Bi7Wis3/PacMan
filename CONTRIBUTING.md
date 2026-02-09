# Contributing to PacMan Game

First off, thank you for considering contributing to PacMan Game! It's people like you that make this project better.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots or animated GIFs** if possible
* **Include browser version and OS**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a detailed description of the suggested enhancement**
* **Provide specific examples to demonstrate the feature**
* **Describe the current behavior** and explain the behavior you expected instead
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Follow the JavaScript coding style used throughout the project
* Include screenshots and animated GIFs in your pull request whenever possible
* End all files with a newline
* Avoid platform-dependent code

## Development Process

1. Fork the repo
2. Create a new branch from `main`:
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes:
   ```bash
   git commit -m "Add some feature"
   ```
6. Push to your fork:
   ```bash
   git push origin feature/my-new-feature
   ```
7. Create a Pull Request

## Coding Standards

### JavaScript Style Guide

* Use ES6+ features
* Use const/let instead of var
* Use meaningful variable and function names
* Add comments for complex logic
* Keep functions small and focused
* Use camelCase for variables and functions
* Use PascalCase for classes

### Example:

```javascript
// Good
const playerSpeed = 5;
function calculateScore(pellets) {
    return pellets * PELLET_POINTS;
}

// Bad
var player_speed = 5;
function calc(p) {
    return p * 10;
}
```

## Adding New Levels

To add a new level:

1. Open `index.js`
2. Find the `levels` array
3. Add a new 30x15 grid array
4. Test the level thoroughly
5. Ensure ghost spawn positions are valid
6. Update README.md if needed

## Testing Checklist

Before submitting a PR, make sure:

- [ ] Game loads without errors
- [ ] Player movement works in all directions
- [ ] Collision detection works properly
- [ ] Ghosts move correctly
- [ ] Score updates correctly
- [ ] Lives system works
- [ ] Level progression works
- [ ] Pause/Resume works
- [ ] Restart works
- [ ] No console errors

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## Code of Conduct

* Be respectful and inclusive
* Accept constructive criticism gracefully
* Focus on what is best for the community
* Show empathy towards other community members

Thank you for contributing! 🎮
