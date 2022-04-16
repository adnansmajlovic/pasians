<script>
  import { onMount } from 'svelte';

  import Card from '../lib/components/Card.svelte';
  import { checkForTransfer } from '$lib/fns/checkForTransfer';

  let key;
  let keyCode;
  let selectedCard;

  const minX = 0;
  const maxX = 6;
  const minY = 0;
  let maxY = 5;

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
  let bindDeckCardsByYX = {};

  let isTransferInProgress = false;
  let isTransferOk = false;
  let source;
  let destination;

  /**
   * a.s. Movement
   *
   * @param event
   */
  function handleKeydown(event) {
    key = event.key;
    keyCode = event.keyCode;

    if (!selectedCard) {
      selectedCard = bindDeckCardsByYX['5-0'];
      selectedCard.isMarked = true;
    }

    const x = selectedCard.x;
    let y = selectedCard.y;
    let thisY;

    console.log('movement', { y, x, deck1Y: deck1[x]?.length, deck1 });

    switch (key) {
      case 'ArrowUp':
        if (y > minY) {
          if (bindDeckCardsByYX[`${y}-${x}`])
            bindDeckCardsByYX[`${y}-${x}`].isMarked = false;
          if (bindDeckCardsByYX[`${y - 1}-${x}`]) {
            bindDeckCardsByYX[`${y - 1}-${x}`].isMarked = true;
            selectedCard = bindDeckCardsByYX[`${y - 1}-${x}`];
          }
        }
        break;
      case 'ArrowDown':
        console.log('down', { y, x, deck1Y: deck1[x]?.length });
        if (y < deck1[x].length - 1) {
          if (bindDeckCardsByYX[`${y}-${x}`])
            bindDeckCardsByYX[`${y}-${x}`].isMarked = false;
          if (bindDeckCardsByYX[`${y + 1}-${x}`]) {
            bindDeckCardsByYX[`${y + 1}-${x}`].isMarked = true;
            selectedCard = bindDeckCardsByYX[`${y + 1}-${x}`];
          }
        }
        break;
      case 'ArrowLeft':
        console.log('left', {
          y,
          x,
          dLength: deck1[x]?.length,
          next: deck1[x - 1],
        });

        if (x > minX) {
          // a.s. prepare y length of the previous column
          thisY = deck1[x - 1].length - 1;

          if (bindDeckCardsByYX[`${y}-${x}`])
            bindDeckCardsByYX[`${y}-${x}`].isMarked = false;

          // a.s. position y at the bottom of the previous column
          y = thisY;

          if (bindDeckCardsByYX[`${y}-${x - 1}`]) {
            bindDeckCardsByYX[`${y}-${x - 1}`].isMarked = true;
            selectedCard = bindDeckCardsByYX[`${y}-${x - 1}`];
          }
        }
        break;
      case 'ArrowRight':
        console.log('right', {
          y,
          x,
          dLength: deck1[x]?.length,
          next: deck1[x + 1],
        });

        if (x < maxX) {
          // a.s. prepare y length of the next column
          thisY = deck1[x + 1].length - 1;

          if (bindDeckCardsByYX[`${y}-${x}`])
            bindDeckCardsByYX[`${y}-${x}`].isMarked = false;

          console.log({ oldY: y, newY: thisY });

          // a.s. position y at the bottom of the next column
          y = thisY;

          if (bindDeckCardsByYX[`${y}-${x + 1}`]) {
            bindDeckCardsByYX[`${y}-${x + 1}`].isMarked = true;
            selectedCard = bindDeckCardsByYX[`${y}-${x + 1}`];
          }
        }
        break;
      case ' ': // space --> mark for transfer
        console.log('mark a card');

        // source is marked for transfer
        if (isTransferInProgress) {
          // if this was a marked source, unmark it
          if (bindDeckCardsByYX[`${y}-${x}`].isSelectedForDrag) {
            bindDeckCardsByYX[`${y}-${x}`].isSelectedForDrag =
              !bindDeckCardsByYX[`${y}-${x}`].isSelectedForDrag;
            isTransferInProgress = false;
          } else {
            // decided to transfer; check if source can go to destination
            destination = bindDeckCardsByYX[`${y}-${x}`];
            console.log(
              'check if source can go to destination',
              source,
              destination,
            );

            console.log({
              sourceY: source.y,
              deckY: deck1[source.x]?.length,
              sourceX: source.x,
              destinationY: destination.y,
              destinationX: destination.x,
            });

            isTransferOk = checkForTransfer({
              source,
              destination,
              deckColumn: deck1[source.x],
            });

            console.log({ isTransferOk, source, destination });

            if (isTransferOk) {
              console.log('transfer ok', {
                source,
                sx: source.x,
                sy: source.y,
                dx: destination.x,
                dy: destination.y,
                deck1,
              });

              // a.s. just testing some concepts
              // most likely need separate arrays for each column
              // const sourceCard = deck1[source.y][source.x];
              const sourceCard = deck1[source.x][source.y];
              let sourceCards = [];

              for (let index = 0; index < deck1[source.x].length; index++) {
                if (deck1[source.x][source.y + index]) {
                  console.log(
                    'ready to insert',
                    deck1[source.x][source.y + index],
                  );
                  sourceCards.push(deck1[source.x][source.y + index]);
                }
              }

              console.log({
                attentioN: 'only this sourceCard',
                sourceCard,
                deck1,
                sourcey: source.y,
                sourcex: source.x,
                sourceCards,
              });

              console.log('1', deck1[source.x].length, {
                c1: deck1[source.x],
              });

              // a.s. delete card(s) from the source column
              deck1[source.x].splice(
                source.y,
                1 + deck1[source.x].length - source.y,
              );

              // a.s. add card(s) to the destination column
              deck1[destination.x].splice(destination.y + 1, 0, ...sourceCards);

              // a.s. refresh the deck1
              deck1 = deck1;

              // clear source and destination
              isTransferInProgress = false;
            } else {
              // transfer not ok
              console.log('transfer not ok');
            }
          }
        } else {
          bindDeckCardsByYX[`${y}-${x}`].isSelectedForDrag =
            !bindDeckCardsByYX[`${y}-${x}`].isSelectedForDrag;
          isTransferInProgress = true;
          source = bindDeckCardsByYX[`${y}-${x}`];
        }
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

  let restOfCards1 = [...restOfCards];

  let deck1 = [];
  for (let x = 0; x < 7; x++) {
    deck1[x] = [];
    for (let y = 0; y < 6; y++) {
      deck1[x][y] = restOfCards1.pop();
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
    <p>Focus this window and use arrow keys to play</p>
    <p>Space to mark the card for a move!</p>
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

<div class="container mx-auto">
  <div class="grid grid-cols-7 gap-1">
    {#each deck1 as colCards, x}
      {#if colCards.length > 0}
        <div class="">
          {#each colCards as { color, letter, symbol }, y}
            <div class="w-full card aspect-auto">
              <Card
                bind:this={bindDeckCards[`${letter}-${symbol}`]}
                size={y > colCards.length - 2 ? 'full' : 'top'}
                {y}
                {x}
                {letter}
                {symbol}
                {color}
              />
              {(bindDeckCardsByYX[`${y}-${x}`] =
                bindDeckCards[`${letter}-${symbol}`])
                ? ''
                : ''}
            </div>
          {/each}
        </div>
      {:else}
        <div class="column w-full card aspect-auto">&nbsp;</div>
      {/if}
    {/each}
  </div>
</div>

<footer>
  <div class="mt-10 bottom-0 bg-green-900 text-center">
    Author: Adnan Smajlovic ⓒ 1985 / Apr 2022
  </div>
</footer>
