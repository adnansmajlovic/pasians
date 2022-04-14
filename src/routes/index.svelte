<script>
  import Card from '../lib/components/Card.svelte';

  const arr = [];

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

  const symbols = ['spade', 'club', 'heart', 'diamond'];

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

  // shuffle array
  arr.sort(() => Math.random() - 0.5);

  console.log(arr);

  const top10Cards = arr.slice(0, 10);
  const restOfCards = arr.slice(10);

  top10Cards.sort(() => Math.random() - 0.5);
  restOfCards.sort(() => Math.random() - 0.5);
</script>

<h1 class="text-3xl font-semibold items-center text-center m-2">
  Pasians - Solitaire
</h1>

<div class="grid grid-cols-10 gap-1 ml-2 mb-4">
  {#each top10Cards as { color, letter, symbol }, i}
    <Card size="full" {letter} {symbol} {color} />
  {/each}
</div>

<div class="grid grid-cols-7 gap-0 ml-2 mb-4">
  {#each restOfCards as { color, letter, symbol }, i}
    <Card size={i > 34 ? 'full' : 'top'} {letter} {symbol} {color} />
  {/each}
</div>
