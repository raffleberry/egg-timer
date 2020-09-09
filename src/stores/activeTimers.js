import { writable } from "svelte/store";


function createActiveStore() {
  const { subscribe, set, update } = writable(0);

  return {
    subscribe,
    increment: () => update(n => n + 1),
    decrement: () => update(n => n - 1),
  }
}

export const activeTimers = createActiveStore();