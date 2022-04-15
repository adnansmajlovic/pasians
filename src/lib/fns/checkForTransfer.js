export function checkForTransfer(params) {
  const { source: s, destination: d } = params;

  const sLetter = s.letter;
  const sSymbol = s.symbol;
  const dLetter = d.letter;
  const dSymbol = d.symbol;

  const intSrcLetter = parseInt(sLetter);
  const intDestLetter = parseInt(dLetter);

  let isTransferOk = false;

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
