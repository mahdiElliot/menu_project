# File Structure

---

# Name Convention

All files should follow this pattern:

_File.[purpose].extention_

purpose ⇒ view | api | style | page | layout | ...

---

# CRM

## public

This `dir` contains files that serve directly in browser

[read more](https://create-react-app.dev/docs/using-the-public-folder)

## src

This `dir` contains react codes

### components

Each component has a directory like:

📂 component

→ Component.view.tsx

→ Component.model.ts

→ Component.style.(s)css

### assets

Files like image, fonts, or any thing related to project

### @types

types goes to this directory

### layouts

page layouts here like `Main.layout.tsx` that contains header and menu on top of every thing.

### pages

pages like `Order.page.tsx` that is shown inside the router

### models

model `dir` is for global models
and for each component or page you should make model file in their `dir`

<!-- ### services

Any api calls and services goes here

`index.api.ts` : there is **makeRequest** that generate a request and every api requests must export with this module

For any apis you must create a directory that contains apis and use makeRequest generic function to generate a request -->

### utils

Utility functions and hooks are in this directory

### 📄 index.tsx

This file is the start of react
