export function checkForTopTransfer(params) {
  const { currentCard, top4columns } = params;

  // a.s. keep in he local scope, to avoid diffefent order if passed as an argument
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

  console.log({ letters, currentCard, top4columns });

  if (currentCard.letter === 'A') {
    top4columns.push([]);
    return { isMoveAllowed: true, columnIndex: null };
  }

  const matchingLetterIndex = letters.indexOf(currentCard.letter);

  for (const [index, column] of top4columns.entries()) {
    console.log({ column, cLength: column.length });
    if (column.length > 0) {
      if (column[column.length - 1].symbol === currentCard.symbol) {
        console.log('symbols are matching');
        console.log({
          letInd: letters.indexOf(column[column.length - 1].letter) + 1,
          matchingLetterIndex,
        });

        if (
          letters.indexOf(column[column.length - 1].letter) + 1 ===
          matchingLetterIndex
        ) {
          console.log('definitely can be added to this column!');
          return { isMoveAllowed: true, columnIndex: index };
        }
      }
    }
  }

  return { isMoveAllowed: false };
}
