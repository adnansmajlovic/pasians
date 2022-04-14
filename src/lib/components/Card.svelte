<svelte:options accessors={true} />

<script>
  export let symbol = 'spade';
  export let color = 'red';
  export let letter = 'A';
  export let size = 'top'; // full, top
  export let x = 0;
  export let y = 0;

  export let isMarked = false;

  const colors = {
    red: 'text-red-800',
    black: 'text-black-800',
  };

  // a.s. reference: https://www.compart.com/en/unicode/block/U+2500
  const topLeftCorner = String.fromCharCode(0x2554);
  const topRightCorner = String.fromCharCode(0x2557);
  const bottomLeftCorner = String.fromCharCode(0x255a);
  const bottomRightCorner = String.fromCharCode(0x255d);
  const doubleVertical = String.fromCharCode(0x2551);
  const doubleHorizontal = String.fromCharCode(0x2550);
  const enSpace = String.fromCharCode(0x2003);

  // ♠ ♣ ♥ ♦
  const symbols = {
    spade: String.fromCharCode(0x2660),
    club: String.fromCharCode(0x2663),
    heart: String.fromCharCode(0x2665),
    diamond: String.fromCharCode(0x2666),
  };

  // ╔═════╗
  // ║     ║
  // ║     ║
  // ║     ║
  // ╚═════╝
</script>

<div
  class="card m-0 font-mono {isMarked ? ' text-blue-900 ' : ' text-green-900 '}"
>
  <div class=" ">
    {topLeftCorner}{doubleHorizontal}{doubleHorizontal}{doubleHorizontal}{doubleHorizontal}{doubleHorizontal}{doubleHorizontal}{doubleHorizontal}{topRightCorner}
  </div>
  <div>
    {doubleVertical}{letter.length > 1 ? '' : enSpace}<span
      class=" {isMarked ? ' bg-blue-800 text-yellow-100' : ' text-green-900 '}"
      >{letter}</span
    >{enSpace}{enSpace}{enSpace}<span class={colors[color]}
      >{symbols[symbol]}</span
    >{enSpace}{doubleVertical}
  </div>
  {#if size === 'full'}
    {#each { length: 3 } as _, i}
      <div>
        {doubleVertical}{enSpace}{enSpace}{enSpace}{enSpace}{enSpace}{enSpace}{enSpace}{doubleVertical}
      </div>
    {/each}

    <div>
      {bottomLeftCorner}{doubleHorizontal}{doubleHorizontal}{doubleHorizontal}{doubleHorizontal}{doubleHorizontal}{doubleHorizontal}{doubleHorizontal}{bottomRightCorner}
    </div>
  {/if}
</div>
