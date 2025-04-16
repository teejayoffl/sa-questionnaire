# WIS Accountancy Self-Assessment Onboarding Journey

A modern, frictionless, conversion-focused self-assessment onboarding web journey for WIS Accountancy's Self-Assessment Tax Return Service.

## Features

- Seamless, anxiety-free user journey with progressive disclosure
- Mobile-responsive design
- WIS Accountancy brand styling with metallic gradients and clean UI
- Smart form sections that dynamically appear based on user responses
- File upload capability for P60/P45 and other documents
- Animated UI elements for a premium feel
- Personalized progress messaging

## Tech Stack

- React with TypeScript
- React Router for navigation
- React Hook Form for form validation and management
- Tailwind CSS for styling
- Framer Motion for animations
- Heroicons for icons

## Project Structure

- `/src/components/common` - Reusable UI components
- `/src/components/sections` - Form sections for each part of the tax return
- `/src/context` - React context for state management
- `/src/pages` - Main page components

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd wis-onboarding
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

To create a production build:

```
npm run build
```

## Implementation Notes

- The journey is designed with progressive disclosure to simplify complex tax forms
- Each section is collapsible and expands only when needed
- Form state is maintained in a global context for persistence
- Validation happens in real-time with friendly error messages
- "Save & Continue Later" functionality is included for long forms
- Submission triggers an approval flow to WIS Accountancy's team

## Future Enhancements

- Integration with OCR for automatic document data extraction
- API integration with HMRC systems
- Additional form sections for specialized tax situations
- Multi-language support
- Dark mode theme
- Accessibility improvements

## License

This project is private and proprietary to WIS Accountancy.
