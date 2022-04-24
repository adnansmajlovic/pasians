export function checkForTransfer(params) {
  const { source: s, destination: d, deckColumn } = params;

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

  // a.s. need to check if the order is right if we
  // try to transfer multiple cards from the same column
  const reversedLetters = letters.reverse();

  const sLetter = s.letter;
  const sSymbol = s.symbol;
  const dLetter = d.letter;
  const dSymbol = d.symbol;

  const intSrcLetter = parseInt(sLetter);
  const intDestLetter = parseInt(dLetter);

  let isTransferOk = false;

  // a.s. check if multiple cards are being transferred
  if (s.y < deckColumn.length - 1) {
    console.log('checkForTransfer multiple cards');

    // a.s. check if the next card is the same symbol
    const firstIndex = reversedLetters.indexOf(deckColumn[s.y].letter);
    for (let i = 0; i < deckColumn.length - s.y; i++) {
      // a.s. check if the next card is the same symbol
      if (deckColumn[s.y + i].symbol !== sSymbol) {
        console.log(
          'multiple cards cannot be transferred due to different symbols',
        );
        isTransferOk = false;
        return isTransferOk;
      }

      const currentIndex = reversedLetters.indexOf(deckColumn[s.y + i].letter);

      if (!(currentIndex === firstIndex || currentIndex === firstIndex + i)) {
        console.log(
          'multiple cards cannot be transferred due to not being ordered correctly',
        );
        isTransferOk = false;
        return isTransferOk;
      }
    }
  } else {
    console.log('checkForTransfer single card');
  }

  // it is a number 2-10
  if (!isNaN(intSrcLetter)) {
    isTransferOk = checkNumbers({
      intSrcLetter,
      intDestLetter,
      dLetter,
    });
  } else {
    isTransferOk = checkLetters({
      sLetter,
      dLetter,
    });
  }

  return isTransferOk;
}

/**
 *
 *
 * @param {*} params
 * @returns
 */
function checkNumbers(params) {
  const { intSrcLetter, intDestLetter, dLetter } = params;

  if (intSrcLetter === intDestLetter) {
    return false;
  }

  if (intSrcLetter === intDestLetter - 1) {
    return true;
  }

  if (intSrcLetter === 10 && dLetter === 'J') {
    return true;
  }

  return false;
}
/**
 *
 *
 * @param {*} params
 */
function checkLetters(params) {
  const { sLetter, dLetter } = params;

  if (sLetter === 'J' && dLetter === 'Q') {
    return true;
  }

  if (sLetter === 'Q' && dLetter === 'K') {
    return true;
  }

  if (sLetter === 'A' && dLetter === '2') {
    return true;
  }

  // a.s. this is an override for the case where the user is trying to transfer
  // multiple cards on top of the King to an empty column
  if (sLetter === 'K' && dLetter === ' ') {
    return true;
  }

  return false;
}
