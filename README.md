# Web-Based-To-do-List
ASE 285 team project building a web-based todo list using Javascript, NodeJs, and MongoDB/SQLite. 

# Our Team

  - (Leader) Nate Brewer - Brewern5@mymail.nku.edu
  - (Member) Philip Bierley
  - (Member) Danny Poff
  - (Member) Jack Dixon

------------------------------------------
# Project overview

## Project Description

A web-based to-do app built using Javascript, NodeJS, and MongoDB/SQLlite. 

## Problem Domain

Using modern solutions - create an 'easy to use' web app that will act as the end-user's 'to-do' list. 

------------------------------------------

# Team Rules and Expectations

**Team Name:** [MG-Monkeys]  
**Project:** [Web-Based To-Do List]  
**Semester:** [Spring 2026]

## Team Members and Roles

- **Team Leader:** [Nate Brewer] - Coordinates meetings, manages timeline, primary contact
- **Developer:** [Danny Poff] - Focuses on [specific features]
- **Developer:** [Jack Dixon] - Focuses on [specific features]
- **Developer:** [Philip Bierley] - Focuses on [specific features]

## Core Principles

### 1. Communication First ("No Surprises" Rule)

- If you can't complete your work by the deadline, notify the team leader **at least 24 hours in advance**
- If you face personal challenges affecting your work, communicate early
- We accommodate challenges when we know about them - we don't accommodate silence

### 2. Weekly Responsibilities

- Update your individual Canvas page **by Friday 11:59 PM** each week
- Include your progress, LoC, and completed tests
- Missing updates = missing contributions in team presentation

### 3. Meeting Attendance

- **Weekly team meetings:** [Day/Time]
- If you can't attend, notify the team **before** the meeting
- Review meeting notes if you miss a meeting

## Work Standards

### Code Quality

- All code must pass unit tests before pushing to main branch
- Use meaningful commit messages
- Follow project coding standards (see `/docs/coding_standards.md`)

### Documentation

- Document your features as you build them
- Update relevant diagrams when making architectural changes
- Keep your individual Canvas page current

### Review Process

- Each dev has their own branch. 
- When feature/requirement is completed - create a pull request, and let the leader review it

## Conflict Resolution

1. Be adults - if you disagree talk it out. If no resolution come to the leader and present both sides. 

## Peer Evaluation Criteria

Team members will be evaluated on:

- **Quality of Contributions** (40%): Code quality, documentation, testing
- **Communication & Collaboration** (30%): Responsiveness, team participation
- **Reliability & Accountability** (30%): Meeting deadlines, following through on commitments

## Consequences for Not Following Rules

- Banishment

## Signatures

By signing below, all team members agree to follow these rules:

- [V] [Nate Brewer] - Date: 1/26/2026
- [V] [Danny Poff] - Date: 1/26/2026
- [V] [Jack Dixon] - Date: 1/26/2026
- [V] [Philip Bierley] - Date: 1/26/2026

---------------------------------------------

# Timeline

## Sprint 1:

1. Adding tags to the to-do list items      
    - DB tag collection
    - Searching/filter for tag's
    - link between tag and post in the DB
    - Tag-validation

2. Front-End user customization
    - Change fonts/font colors
    - Add primary, secondary, trutiary colors
    - Look for text editor packages to add

## Sprint 2:

3. Using ai to automatically generate tags
    - Hit an external genAI api to create tags
    - Tag validation

4. Adding notifications to the browser 
    - Figure out which browser the user is on automatically
    - Hit the specific browsers API to send notifs
    - User-set notification time

5. (Start) Create a mascot that also acts like a chatbot (Monkey-see Monkey-do)
    - GenAI API for the chatbot. 
    - Interact with to-dos (Have celebrations/negative reactions when one is not done)
    - Create per-page popup that the user can interact with
    - Interface with the to-do's to create reactions.

## Sprint 3:

6. (Start) Group to-do list for team projects
    - Non-authed p2p invitiation 
    - Database collection of the group
    - Accept/Decline invitation page/popup
    - Group Page (re-skin of individual page)
    - Group to-do assignment: 2 approaches
        - Who ever created the page will assign and create to-dos
        - Non-hierarchical approach, users will create to-dos and have a "liking" system that will similar to assignment

7. Repeating to-dos
    - Use weekly/monthly reminders 

## Sprint 4:

(Finish) Create a mascot that also acts like a chatbot (Monkey-see Monkey-do)

(Finish) Group to-do list for team projects

2. Email notifications (SMS - Maybe)
    - utilize external package Email service to send user reminders 
    - (if using sms - find an pacakge for that)
