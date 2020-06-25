declare namespace Schema{
  type Settings = {
    '$schema': "./settings.schema.json",
    'application': {
      'language-support': Table<string>
    },
    'cookie': {
      'age': number,
      'secret': string
    },
    'https'?: {
      'key': string,
      'cert': string
    },
    'log': {
      'directory': string,
      'interval': number
    },
    'port': number,
  };
}