---
title: "This is mermaid"
date: 2021-01-01
draft: true
slug: this-is-mermaid
cover: "/public/assets/media/portfolio.jpg"
description: "mermaid is a flowcharting language for diagrams, that is based on the graphviz language."

---
# Hello mermaid


```mermaid
flowchart BT

A[Hard] -->|Text| B(Round)
B --> C{Decision}
C -->|Deal| F[Result 1]
C -->|Two| E[Result 2]
A -->|Three| BX

```

SSomething else

```mermaid

graph TD
    A[Hard] -->|Text| B(Round)
    B --> C{Decision}
    C -->|Deal| F[Result 1]
    C -->|Two| E[Result 2]
    A -->|Three| BX
```