import { writable } from "svelte/store";

const makeId = () => {
  return Date.now().toString();
}

// fetch from Persistent storage
const getAll = () => {
  var r = [];
  var keys = Object.keys(localStorage);
  keys.sort();
  for (var i = 0; i < keys.length; i++) {
    r.push(JSON.parse(localStorage[keys[i]]));
  }
  return r;
}

function createDb() {
  const { subscribe, update: _update } = writable(getAll());

  return {
    subscribe,
    create: (name, time) => {
      var tid = makeId();
      var newTimer = {
        tid, name, time
      }

      // Persistence
      localStorage.setItem(tid, JSON.stringify(newTimer));
      
      // State 
      _update(snap => [...snap, newTimer]);
    },
    update: (tid, name, time) => {

      // Persistence
      localStorage.setItem(tid, JSON.stringify({
        tid,
        name,
        time
      }));

      // State 
      _update(snap => {
        for (var i = 0; i < snap.length; i++) {
          if (snap[i].tid === tid) {
            snap[i].name = name;
            snap[i].time = time;
            return snap;
          }
        }
      });
    },
    remove: (tid) => {

      // Persistence
      localStorage.removeItem(tid);

      // State 
      _update(snap => {
        for (var i = 0; i < snap.length; i++) {
          if (snap[i].tid === tid) {
            snap.splice(i, 1);
            return snap;
          }
        }
      });
    }
  };
}

export const db = createDb();
