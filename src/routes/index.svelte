<script>
  import { onMount } from 'svelte';

  import Card from '../lib/components/Card.svelte';

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

  let bindTopCards;
  let bindDeckCards = {};

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
  console.log({ deck });

  onMount(() => {
    const cards = document.querySelectorAll('.card');
    console.log({ cards });
    console.log({ bindDeckCards, bindTopCards });
    // for (const card of cards) {
    //   card.classList.add('flip');
    // }
  });
</script>

<h1 class="text-3xl font-semibold items-center text-center m-2">
  Pasians - Solitaire
</h1>

<div class="grid grid-cols-10 gap-1 ml-2 mb-4">
  {#each top10Cards as { color, letter, symbol }, i}
    <Card bind:this={bindTopCards} size="full" {letter} {symbol} {color} />
  {/each}
</div>

<div class="grid grid-cols-7 gap-0 ml-2 mb-4">
  {#each deck as card, i}
    {#each card as { color, letter, symbol }, j}
      <Card
        bind:this={bindDeckCards[`${letter}-${symbol}`]}
        size={i > deck.length - 2 ? 'full' : 'top'}
        {letter}
        {symbol}
        {color}
      />
    {/each}
  {/each}
</div>
