# Scholar Metrics Analyzer

Enhances Google Scholar profiles with advanced metrics and analytics.

## Features

- Advanced citation metrics (h-index, g-index, i10-index)
- Publication analysis
- Self-citation tracking
- Co-author network analysis
- Visual metrics display
- Detailed tooltips with metric explanations

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/scholar-metrics-analyzer.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `dist` folder from the project

## Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Make your changes
3. The extension will automatically rebuild when files change

## Testing

1. Build the extension:
   ```bash
   npm run build
   ```

2. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked"
   - Select the `dist` folder

3. Navigate to any Google Scholar profile (e.g., https://scholar.google.com/citations?user=...)
4. The enhanced metrics will appear automatically

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
