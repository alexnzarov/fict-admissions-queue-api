export interface IToken {
  name: string;
  text: string;
  token: string;
};

export const tokens: IToken[] = [
  {
    name: 'Прізвище',
    text: 'Будь ласка, введіть своє прізвище (наприклад: Фітільов)',
    token: 'last_name',
  },
  {
    name: 'Ім\'я',
    text: 'Введіть своє ім\'я (наприклад: Микола) ',
    token: 'first_name',
  },
  {
    name: 'По батькові',
    text: 'Введіть своє по батькові (наприклад: Григорович)',
    token: 'father_name',
  },
];
