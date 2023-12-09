+++
date = 2023-10-26
title = "Bags"
description = "Bags are add-only collections"
draft = true
+++

<script type="module" src="bags.js"></script>

The bag data type is a collection that doesn't support removal.

Here's its basic interface:

```typescript
interface Bag<T> {
    add(item: T): void;
    isEmpty(): boolean;
    size(): number;
}
```

It serves as a starting point in the red book for talking about data structures.

<canvas id="canvas" width="512" height="512"></canvas>
