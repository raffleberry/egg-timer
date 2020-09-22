<script>
  import { onDestroy } from "svelte";
  import { writable } from "svelte/store";

  import { db } from "../stores/db.js";
  import { activeTimers } from "../stores/activeTimers.js";
  import { beep } from "../utils/beep.js";
  
  export let tid;
  export let initialTime;
  export let name;

  $: running = false;
  $: timer = initialTime;
  var timerId;

  const stop = () => {
    clearInterval(timerId);
    timerId = undefined;
    activeTimers.decrement();
    running = false;
    timer = initialTime;
  };

  const start = () => {
    activeTimers.increment();
    running = true;
    timerId = setInterval(() => {
      if (timer == 0) {
        beep();
        alert("Stop! Stop!");
        beep();
        stop();
      } else {
        timer = timer - 1;
      }
    }, 1000);
  };

  const remove = () => {
    if (running) return;
    db.remove(tid);
  }
  const toMS = (s) => {
    var min = Math.floor(Number(s) / 60);
    var sec = s - min * 60;
    return min.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0');
  }

  const stringToSeconds = (newTime) => {
    var m = Number(newTime.split(":")[0]), s = Number(newTime.split(":")[1]);
    return m*60 + s;
  }

  const save = (e) => {
    e.preventDefault();
    if (e.keyCode == 13) {
      var mmss = new RegExp("^([0-9]+):[0-5][0-9]$");
      var newName = document.getElementById(tid + "name").value;
      var newTime = document.getElementById(tid + "timer").value;
      if (mmss.test(newTime) && newName.length != 0) {
        db.update(tid, newName, stringToSeconds(newTime));
      } else {
        document.getElementById(tid + "name").value = name;
        document.getElementById(tid + "timer").value = toMS(initialTime);
      }
    }
  }

  onDestroy(() => clearInterval(timerId));
</script>

<div style="display: none;">
{#if running}
  { document.title = "🐣Timer: " + toMS(timer) }
{/if}
</div>

<div class="timerRow">
  <tr>
    <td>
      <input type="text" name={tid + "name" } id={tid + "name" } value={name} class="name" on:keyup={save}>
    </td>
    <td>
      {#if running}
        <input type="text" name={tid + "timer" } id={tid + "timer" } value={toMS(timer)} class="timer" disabled>
      {:else}
        <input type="text" name={tid + "timer" } id={tid + "timer" } value={toMS(timer)} class="timer" on:keyup={save} on:click="" placeholder="MM:SS">
      {/if}
    </td>
    <td>
      {#if !running}
        {#if $activeTimers != 0}
          <button on:click={start} disabled>Start</button>
        {:else}
          <button on:click={start}>Start</button>
        {/if}
      {:else}
        <button  on:click={stop}>Stop‎‎‎‎‏‏‎&nbsp;‎</button>
      {/if}
    </td>
    <td class="no-padding">
      <button on:click={remove} class="hide close-btn no-padding" >
        ❌
      </button>
    </td>
  </tr>
</div>

<style>
  .timer {
    width: 3em;
  }
  .timerRow:hover .hide {
    opacity: 100%;
  }
  .hide {
    opacity: 0%;
  }
  .close-btn {
    background-color: transparent;
  }
  .no-padding {
    width: 2.5em;
    padding-left: 0px;
    padding-right: 0px;
  }
  .name {
    width: 10em;
  }
  :disabled {
    pointer-events: none;
  }
</style>