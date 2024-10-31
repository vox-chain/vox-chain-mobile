# VoxChain

## Overview

VoxChain is a mobile application that simplifies blockchain interactions through voice commands or written instructions. By utilizing the Whisper LLM and IntentMaker API, VoxChain transforms user commands into actionable transactions, making blockchain technology more accessible and intuitive.

## Features

- **Voice Commands**: Users can execute commands by speaking, thanks to advanced speech-to-text processing and natural language understanding.
- **Written Commands**: Alternatively, users can type their commands to interact with the blockchain.
- **Intent Extraction**: The application extracts user intent and desired actions to confirm and execute transactions.
- **User-Friendly Interface**: Designed to mask the complexity of blockchain interactions, VoxChain provides a seamless user experience.

## Getting Started

### Prerequisites

- Node.js (version 14.x or later)
- Expo CLI installed globally
- A compatible device or simulator for Android or iOS

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ft-hackathon-2024.git
   cd apps/mobile
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

### Running the Application

To start the development server, run:

```bash
npm run dev
```

For Android, you can run:

```bash
npm run android
```

For iOS, run:

```bash
npm run ios
```

For web, use:

```bash
npm run web
```

### Building the Application

To create a production build, run:

```bash
npm run build
```

### Scripts

- **dev**: Starts the Expo development server.
- **lint**: Runs ESLint to check for code quality.
- **lint-fix**: Automatically fixes linting issues.
- **build**: Exports the application for production.
- **start**: Starts the application in LAN mode.
- **android**: Runs the application on an Android device or emulator.
- **ios**: Runs the application on an iOS device or simulator.
- **web**: Runs the application in a web environment.
- **clean**: Cleans up the project by removing build artifacts and node modules.

## How VoxChain Works

### Voice Processing and NLP

VoxChain leverages AI-powered voice recognition to capture user commands. Upon receiving a command (e.g., "Send 0.5 ETH to Alice"), the app translates it into a blockchain-ready transaction using Natural Language Processing (NLP).

### Integration with Blockchain Protocols

VoxChain interacts with various blockchain protocols through APIs. It enables wallet interactions, address lookups, balance checks, and transaction execution.

### Smart Contract Development

To execute transactions efficiently and securely, smart contracts are developed, which allow VoxChain to handle user transactions while maintaining safety protocols.

## Key Learnings

- **Voice Processing and AI Models**: Integrating voice recognition and NLP helps in understanding user commands in a variety of contexts.
- **User Experience and Security**: Balancing an intuitive interface with robust security measures is crucial for user trust and safety.

## Challenges Faced

- **Intent Recognition**: Accurately interpreting diverse command structures proved challenging.
- **Latency in Processing**: Ensuring fast response times for voice commands and transaction processing was essential for a smooth user experience.
- **Blockchain Security Risks**: Maintaining secure transactions while leveraging AI for command interpretation was a constant concern.

## Future Improvements

- **Integrate More Blockchain Networks**: Expanding support for various blockchain ecosystems.
- **Enhance AI Model Accuracy**: Continuously improve the AI model to better recognize user intents.
- **Simplify Transaction Handling**: Using account abstraction to streamline the onboarding process for users.

## Conclusion

VoxChain aims to revolutionize the way users interact with blockchain technology, making it as simple as having a conversation. We are committed to enhancing the user experience and accessibility of decentralized finance.
