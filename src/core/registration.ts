export interface IToken {
  name: string;
  token: string;
};

export const tokens: IToken[] = [
  {
    name: 'Прізвище',
    token: 'last_name',
  },
  {
    name: 'Ім\'я',
    token: 'first_name',
  },
  {
    name: 'По батькові',
    token: 'father_name',
  },
];
