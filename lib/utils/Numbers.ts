export const transformNumber = number => {
  // convert number to string
  number = Number(number);
  let newNumber = number.toString();
  // split the number by the decimal point
  let parts = newNumber.split('.');
  // add the point every three digits before the decimal point
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  // if there is a decimal part add the comma
  if (parts[1]) {
    parts[1] = ',' + parts[1];
  }
  // join the number again
  newNumber = parts.join('');
  return newNumber;
};

export const transformNumberString = numberString => {
  const cleanedString = numberString.replace(/[.,]/g, m =>
    m === ',' ? '.' : ''
  );
  return parseFloat(cleanedString);
};
