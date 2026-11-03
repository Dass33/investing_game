# 💸 Inveting Game
This game is part of Skoala education platform. Goal of the game is to introduce investing to children in approchable and fun way.
## 🤷🏻 "Why?"
Existing investing simulators are too complex and overwhelm beginners with informaton and choices. Purpose of this game is to be easy and show same basic options what can one to with their money.
## 🚀 Quick start
It is very easy to start, just click the link [here](dass33.github.io/investing_game/).
## Contributing
Unfortunately to this project can't be contributed.
## 🧪 Testing
Small phones are easy to break, so there is a layout test that plays through the whole game at phone sizes from 320 px wide (solo game and campaign) and fails when something sticks out of the screen, a button label wraps or the round screen overlaps its button.
```sh
yarn install
npx playwright install chromium   # first time only
yarn test
```
The test does not use the live Google Sheet; it serves the data from `tests/fixtures/game-data.json` (same structure, sample Czech texts), so it runs offline.
