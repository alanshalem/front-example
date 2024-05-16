import {
  validarTops,
  validarBankTrade,
  validarTesin,
} from '@lib/helpers/BoletoSimi.helpers';

test('Validar BankTrade', () => {
  const result = validarBankTrade('E002725010PAY2359591');
  expect(result).toBeTruthy();
});

test('Validar Tops', () => {
  const result = validarTops('20211012O00000002701');
  expect(result).toBeTruthy();
});

test('Validar Tesin', () => {
  const result = validarTesin('81234567890123456789');
  expect(result).toBeTruthy();
});
