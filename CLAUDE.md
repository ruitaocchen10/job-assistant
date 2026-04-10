# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A local job search productivity app designed to centralize and automate the job hunt. The system pulls jobs from free APIs and site scrapers, uses an LLM to filter and rank them, and stores results in a database. From there, the frontend lets the user browse, apply to, track, or discard jobs via a Kanban-style interface.

A relational lead tracking system links contacts/leads to specific job opportunities. The app integrates with **Claude Cowork** (Claude Desktop) to deliver a daily brief and support natural language queries for organizing and searching the database.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

No test runner is configured.
