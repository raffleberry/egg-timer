<script>
  import { db } from "../stores/db.js";

  let name = "", timer = "";

  const toMS = (s) => {
    var min = Math.floor(Number(s) / 60);
    var sec = s - min * 60;
    return min.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0');
  }


  const stringToSeconds = (newTime) => {
    var m = Number(newTime.split(":")[0]), s = Number(newTime.split(":")[1]);
    return m*60 + s;
  }

  const add = (e) => {
    e.preventDefault();
    if (e.keyCode == 13 || e.type === "click") {
      var mmss = new RegExp("^([0-9]+):[0-5]|[0-9]$");
      if (mmss.test(timer) && name.length != 0) {
        db.create(name, stringToSeconds(timer));
        name = "";
        timer = "";
      } else {
        alert("invalid name or Time(Minutes:Seconds)")
      }
    }
  }

</script>

<div class="timerRow">
  <tr>
    <td>
      <input type="text" name="newName" id="newName" bind:value={name} class="name" placeholder="Name" on:keyup={add}>
    </td>
    <td>
      <input type="text" name="newTimer" id="newTimer" bind:value={timer} class="timer" placeholder="MM:SS"
        on:keyup={add}>
    </td>
    <td>
      <button on:click={add}>Add+</button>
    </td>
    <td class="no-padding">
      <button class="hide close-btn no-padding">
        ❌
      </button>
    </td>
  </tr>
</div>

<style>
  .timer {
    width: 3em;
  }

  .hide {
    opacity: 0%;
  }

  .close-btn {
    background-color: transparent;
    pointer-events: none;
  }

  .no-padding {
    width: 2.5em;
    padding-left: 0px;
    padding-right: 0px;
  }

  .name {
    width: 10em;
  }
</style>