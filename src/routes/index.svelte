<script>
  import { onMount, tick } from 'svelte';

  import Card from '../lib/components/Card.svelte';
  import { checkForTransfer } from '$lib/fns/checkForTransfer';
  import { checkForTopTransfer } from '$lib/fns/checkForTopTransfer';

  let key;
  let keyCode;
  let selectedCard;

  const minX = 0;
  const maxX = 7;
  const minY = 0;
  let maxY = 7;

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

  let x = 0;
  let y = 0;
  let deck1 = [];
  let top4columns = [];

  /**
   * a.s. Movement
   *
   * @param event
   */
  function handleKeydown(event) {
    key = event.key;
    keyCode = event.keyCode;

    if (!selectedCard) {
      // a.s. this logic here is weak, and causing the problem with
      // the cards not being selected after the previous one was
      // sent to the top...
      // TODO fix this
      // selectedCard = bindDeckCardsByYX['0-0'];
      // a.s. this is a bit better, handle when a column is empty
      selectedCard = bindDeckCardsByYX[`${deck1[x].length - 1}-${x}`];
      selectedCard.isMarked = true;
    }

    console.log({ key, keyCode });
    x = selectedCard.x;
    y = selectedCard.y;
    let thisY;

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
          if (deck1[x - 1]?.length === 0) {
            x--;
          }

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

        if (deck1[x + 1]?.length === 0) {
          x++;
        }

        if (x < maxX) {
          // a.s. prepare y length of the next column
          thisY = deck1[x + 1].length - 1;

          if (bindDeckCardsByYX[`${y}-${x}`])
            bindDeckCardsByYX[`${y}-${x}`].isMarked = false;

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

            // a.s. check if destination card is the last one
            //
            if (destination.y !== deck1[destination.x].length - 1) {
              console.log('destination is not the last card in a column');
              // isTransferOk = false;
            } else {
              // a.s. check if source can go to destination
              isTransferOk = checkForTransfer({
                source,
                destination,
                deckColumn: deck1[source.x],
              });
            }

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
      // a.s. mark to send to the top
      case 'x':
      case 'X':
        if (y !== deck1[x].length - 1) {
          console.log('has to be the last card in a column');
          break;
        }

        // a.s. move King to an empty column
        if (deck1[x][y].letter === 'K') {
          for (const [index, column] of deck1.entries()) {
            console.log({ column, index, cLength: column.length, x, y });
            if (column.length === 0) {
              console.log('empty column');
              // a.s. delete card(s) from the source column
              const sourceCards = deck1[x].splice(y, 1 + deck1[x].length - y);

              console.log({ sourceCards, cLength: column.length });
              // a.s. add card(s) to the destination column
              deck1[index].splice(column.length, 0, ...sourceCards);
              selectedCard = null;

              x = index;
              y = column.length - 1;
              // a.s. refresh the deck1
              deck1 = deck1;

              break;
            }
          }
        } else {
          const { isMoveAllowed, columnIndex } = checkForTopTransfer({
            letters,
            currentCard: deck1[x][y],
            top4columns,
          });

          if (isMoveAllowed) {
            const letter = deck1[x][y].letter;
            const symbol = deck1[x][y].symbol;

            // TODO: need a matching index of the column
            const x1 =
              letter === 'A' ? top4columns.length - 1 : columnIndex || 0;
            const y1 = top4columns[x1].length + 1;

            // a.s. delete card(s) from the source column
            console.log({ selectedCard, dk: deck1[x] });
            console.log(deck1[x][y]);
            // a.s. add card(s) to the top column
            top4columns[x1].splice(y1, 0, deck1[x][y]);
            top4columns = top4columns;

            // a.s. remove the last card from the column
            const res = deck1[x].splice(deck1[x].length - 1, 1);

            y = deck1[x].length > 0 ? deck1[x].length - 1 : 0;

            if (bindDeckCardsByYX[`${y}-${x}`]) {
              delete bindDeckCardsByYX[`${y}-${x}`];
              delete bindDeckCards[`${letter}-${symbol}`];
              selectedCard = null;
            }

            deck1 = deck1;
          } else {
            console.log('cannot be sent to the top');
          }

          break;
        }

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

  // const restOfCards = arr.slice(10);
  const restOfCards = arr;

  // shuffle
  // top4columns.sort(() => Math.random() - 0.5);
  restOfCards.sort(() => Math.random() - 0.5);

  let restOfCards1 = [...restOfCards];

  for (let x = 0; x < 8; x++) {
    deck1[x] = [];
    for (let y = 0; y < 6; y++) {
      if (restOfCards1.length > 0) {
        deck1[x][y] = restOfCards1.pop();
      }
    }
  }

  for (let x = 0; x < 4; x++) {
    for (let y = 6; y < 7; y++) {
      if (restOfCards1.length > 0) {
        deck1[x][y] = restOfCards1.pop();
      }
    }
  }

  onMount(() => {
    const cards = document.querySelectorAll('.card');
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<h1 class="text-3xl font-semibold items-center text-center m-2 text-[#209CEE]">
  Pasians - Solitaire (v 80's)
</h1>

<div style="text-align: center">
  {#if !key}
    <p>Focus this window and use arrow keys [← ↑ → ↓] to play</p>
    <p>[Space] to mark/unmark the card for a move and drop!</p>
    <p>
      [X] to send the card to the Top row (has to start w/ A), or King to an
      empty column
    </p>
  {/if}
</div>

<div class="grid grid-cols-10 gap-1 ml-2 mb-4">
  {#each top4columns as topCol}
    {#each topCol as { color, letter, symbol }, i}
      <!-- {#if i === topCol.length - 1} -->
      {#if i === topCol.length - 1}
        <Card
          bind:this={bindTopCards[`${letter}-${symbol}`]}
          size="full"
          {letter}
          {symbol}
          {color}
        />
      {/if}
    {/each}
  {/each}
  <!-- {#each top4columns as { color, letter, symbol }, i}
    <Card
      bind:this={bindTopCards[`${letter}-${symbol}`]}
      size="full"
      {letter}
      {symbol}
      {color}
    />
  {/each} -->
</div>

<div class="container mx-auto">
  <div class="grid grid-cols-8 gap-1">
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
  <div class="mt-10 bottom-0 bg-blue-400 text-center">
    Author: Adnan Smajlovic ⓒ originally created with Borland Turbo C, ~1987 in
    Sarajevo / re-written in SvelteKit, during a weekend, Apr 2022 😁
  </div>
</footer>
