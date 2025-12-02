# JobTrack AI - Deployment Guide

This guide explains how to deploy the JobTrack AI application to GitHub and host it for free.

## 1. Prerequisites

-   **Node.js** installed (which you have).
-   **Git** installed.
-   A **GitHub Account**.

## 2. Push Code to GitHub

Since we have already initialized the repository locally, follow these steps to push it to GitHub:

1.  **Create a New Repository on GitHub**:
    *   Go to [github.com/new](https://github.com/new).
    *   Repository Name: `jobtrack-ai` (or any name you prefer).
    *   Visibility: **Public** (or Private).
    *   **Do NOT** initialize with README, .gitignore, or License (we already have them).
    *   Click **Create repository**.

2.  **Link and Push**:
    Copy the commands provided by GitHub under "…or push an existing repository from the command line" and run them in your terminal:

    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/jobtrack-ai.git
    git branch -M main
    git push -u origin main
    ```

## 3. Deploy to the Web (Vercel)

The easiest way to host this application is using **Vercel**.

1.  Go to [vercel.com](https://vercel.com) and sign up/login with GitHub.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `jobtrack-ai` repository.
4.  **Environment Variables**:
    *   Expand the "Environment Variables" section.
    *   Key: `VITE_GEMINI_API_KEY`
    *   Value: `Your_Gemini_API_Key_Here` (Copy it from your local `.env` file).
5.  Click **Deploy**.

## 4. Building the Desktop App (Future Step)

Once the web version is stable and deployed, we can convert it to a desktop app using Electron.
-   This will involve adding `electron` and `electron-builder` packages.
-   Configuring the main process to handle window creation.
-   Switching from `localStorage` to file-system based storage for persistence.
