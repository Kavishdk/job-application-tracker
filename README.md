# JobTrack AI

Keeping track of job applications can be chaotic. Spreadsheets are boring, and manual entry is tedious. **JobTrack AI** is a simple, personal tool designed to make this process easier and a bit more intelligent.

It's a clean, distraction-free dashboard where you can manage your job search. The core idea is simple: paste a job description, and let AI handle the boring part of extracting the details.

## What it Does

*   **Smart Extraction**: Instead of copy-pasting "Company Name," "Role," and "Requirements" one by one, just paste the entire JD. The app uses Google's Gemini AI to pull out the key info automatically.
*   **Pipeline View**: See exactly where you stand with every company—whether you've just applied, are in the interview phase, or have an offer in hand.
*   **Interview Rounds**: Keep notes on specific interview rounds, questions asked, and feedback received.
*   **Private & Local**: This isn't a SaaS product. It runs entirely in your browser, and your data is stored locally on your device. No accounts, no tracking.

## Getting Started

If you want to run this yourself, it's pretty straightforward.

### Prerequisites
You'll need [Node.js](https://nodejs.org/) installed on your computer.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Kavishdk/job-application-tracker.git
    ```
2.  Navigate into the folder:
    ```bash
    cd job-application-tracker
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Configuration

To make the AI features work, you need a Gemini API key (it's free for personal use).

1.  Create a file named `.env` in the root folder.
2.  Add your key like this:
    ```
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

### Running the App

Start the development server:
```bash
npm run dev
```
Open your browser to `http://localhost:3000`, and you're good to go.

## Tech Stack

*   **React** for the user interface.
*   **Tailwind CSS** for styling.
*   **Vite** for fast build times.
*   **Google Gemini API** for the intelligence.

---
*Built for a smoother job hunt.*
