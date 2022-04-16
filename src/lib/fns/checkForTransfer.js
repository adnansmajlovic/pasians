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

    console.log('loop:', {
      start: s.y,
      length: deckColumn.length - 1,
      deckColumn,
    });
    // a.s. check if the next card is the same symbol
    for (let i = s.y; i < deckColumn.length; i++) {
      console.log('☝️ loop:', {
        i,
        letter: deckColumn[i].letter,
        symbol: deckColumn[i].symbol,
        dSymbol,
      });

      if (deckColumn[i].symbol !== sSymbol) {
        console.log(
          'multiple cards cannot be transferred due to different symbols',
        );
        isTransferOk = false;
        return isTransferOk;
      }

      const previousIndex = reversedLetters.indexOf(deckColumn[i - 1].letter);
      const currentIndex = reversedLetters.indexOf(deckColumn[i].letter);
      console.log('☝️ indexes:', {
        previousIndex,
        pl: deckColumn[i - 1].letter,
        currentIndex,
        cl: deckColumn[i].letter,
      });
      if (previousIndex !== currentIndex - 1) {
        console.log(
          'multiple cards cannot be transferred due to different order',
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
  // a.s. actually we can move from 2 to 3 even if the symobls are not the same
  // but when we get to multiples it will be important
  // if (sSymbol !== dSymbol) {
  //   return false;
  // }

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

  return false;
}
