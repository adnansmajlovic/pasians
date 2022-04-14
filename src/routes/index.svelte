<script>
  import { onMount } from 'svelte';

  import Card from '../lib/components/Card.svelte';

  let key;
  let keyCode;
  let selectedCard;

  const arr = [];
  const symbols = ['spade', 'club', 'heart', 'diamond'];
  const letters = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
  ];

  let bindTopCards = {};
  let bindDeckCards = {};
  let bindDeckCardsByXY = {};

  /**
   * a.s. Movement
   *
   * @param event
   */
  function handleKeydown(event) {
    key = event.key;
    keyCode = event.keyCode;

    if (!selectedCard) {
      // selectedCard = bindDeckCards['2-heart'];
      selectedCard = bindDeckCardsByXY['0-5'];
      console.log({ selectedCard });
      console.log({ x: selectedCard.x, y: selectedCard.y });
      selectedCard.isMarked = true;
    }

    const x = selectedCard.x;
    const y = selectedCard.y;
    const minX = 0;
    const maxX = 6;
    const minY = 0;
    const maxY = 5;

    console.log({ bindDeckCardsByXY });
    switch (key) {
      case 'ArrowUp':
        console.log('up', x, y);
        if (y > minY) {
          bindDeckCardsByXY[`${x}-${y}`].isMarked = false;
          bindDeckCardsByXY[`${x}-${y - 1}`].isMarked = true;
          selectedCard = bindDeckCardsByXY[`${x}-${y - 1}`];
        }
        break;
      case 'ArrowDown':
        console.log('down', x, y);
        if (y < maxY) {
          bindDeckCardsByXY[`${x}-${y}`].isMarked = false;
          bindDeckCardsByXY[`${x}-${y + 1}`].isMarked = true;
          selectedCard = bindDeckCardsByXY[`${x}-${y + 1}`];
        }
        break;
      case 'ArrowLeft':
        console.log('left', x, y);
        if (x > minX) {
          bindDeckCardsByXY[`${x}-${y}`].isMarked = false;
          bindDeckCardsByXY[`${x - 1}-${y}`].isMarked = true;
          selectedCard = bindDeckCardsByXY[`${x - 1}-${y}`];
        }
        break;
      case 'ArrowRight':
        console.log('right', x, y);
        if (x < maxX) {
          bindDeckCardsByXY[`${x}-${y}`].isMarked = false;
          bindDeckCardsByXY[`${x + 1}-${y}`].isMarked = true;
          selectedCard = bindDeckCardsByXY[`${x + 1}-${y}`];
        }
        break;
      case 'Space':
        console.log('mark');
        break;
      default:
        break;
    }
  }

  // shuffle
  letters.sort(() => Math.random() - 0.5);
  symbols.sort(() => Math.random() - 0.5);

  for (const letter of letters) {
    for (const symbol of symbols) {
      arr.push({
        color: ['heart', 'diamond'].includes(symbol) ? 'red' : 'black',
        letter,
        symbol,
      });
    }
  }

  // shuffle
  arr.sort(() => Math.random() - 0.5);

  const top10Cards = arr.slice(0, 10);
  const restOfCards = arr.slice(10);

  // shuffle
  top10Cards.sort(() => Math.random() - 0.5);
  restOfCards.sort(() => Math.random() - 0.5);

  // let deck = [7][6];
  let deck = [];
  for (let y = 0; y < 6; y++) {
    deck[y] = [];
    for (let x = 0; x < 7; x++) {
      deck[y][x] = restOfCards.pop();
    }
  }

  onMount(() => {
    const cards = document.querySelectorAll('.card');
    console.log({ cards });
    console.log({ bindDeckCards, bindTopCards });
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<h1 class="text-3xl font-semibold items-center text-center m-2">
  Pasians - Solitaire
</h1>

<div style="text-align: center">
  {#if key}
    <kbd>{key === ' ' ? 'Space' : key}</kbd>
    <p>{keyCode}</p>
  {:else}
    <p>Focus this window and press any key</p>
  {/if}
</div>

<div class="grid grid-cols-10 gap-1 ml-2 mb-4">
  {#each top10Cards as { color, letter, symbol }, i}
    <Card
      bind:this={bindTopCards[`${letter}-${symbol}`]}
      size="full"
      {letter}
      {symbol}
      {color}
    />
  {/each}
</div>

<div class="grid grid-cols-7 gap-0 ml-2 mb-4">
  {#each deck as card, y}
    {#each card as { color, letter, symbol }, x}
      <Card
        bind:this={bindDeckCards[`${letter}-${symbol}`]}
        size={y > deck.length - 2 ? 'full' : 'top'}
        {y}
        {x}
        {letter}
        {symbol}
        {color}
      />
      <!-- assign the binded "this" to coordinates -->
      {(bindDeckCardsByXY[`${x}-${y}`] = bindDeckCards[`${letter}-${symbol}`])
        ? ''
        : ''}
    {/each}
  {/each}
</div>
