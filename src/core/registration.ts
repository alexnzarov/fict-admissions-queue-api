export interface IToken {
  name: string;
  text: string;
  token: string;
  optional: boolean;
  values?: string[];
};

export const tokens: IToken[] = [
  {
    name: 'Прізвище',
    text: 'Будь ласка, введіть своє прізвище (наприклад: Фітільов)',
    token: 'last_name',
    optional: false,
  },
  {
    name: 'Ім\'я',
    text: 'Введіть своє ім\'я (наприклад: Микола) ',
    token: 'first_name',
    optional: false,
  },
  {
    name: 'По батькові',
    text: 'Введіть своє по батькові (наприклад: Григорович)',
    token: 'father_name',
    optional: false,
  },

  {
    name: 'Стать',
    text: 'Будь ласка, вкажіть вашу стать\n\n<i>Ваші особисті дані будуть використані лише для формування заявки на вступ.</i>',
    token: 'gender',
    values: ['Чоловіча', 'Жіноча'],
    optional: true,
  },
  {
    name: 'Пошта',
    text: 'Вкажіть вашу електронну пошту (наприклад: john@gmail.com)\n\n<i>Ваші особисті дані будуть використані лише для формування заявки на вступ.</i>',
    token: 'email',
    optional: true,
  },
  {
    name: 'Телефон',
    text: 'Вкажіть ваш номер телефону (наприклад: +380961234567)\n\n<i>Ваші особисті дані будуть використані лише для формування заявки на вступ.</i>',
    token: 'phone_number',
    optional: true,
  },
];
