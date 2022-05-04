# Global config

When creating the client with `createSchemaOrg` you are able to provide global configuration which will be used to provide
default values where applicable.

- **canonicalHost**: `string`

  - **default**: `window.location.hostname`

  The production URL of your site. This allows the client to generate all URLs for you and is important to set correctly.

- **defaultLanguage**: `string`

  - **default**: `en`

  Will set the `isLanguage` to this value for any Schema which uses it. Should be a valid language code, i.e `en-AU`

- **defaultCurrency**: `string`

  - **default**: `undefined`

  Will set the `priceCurrency` for [Product](/schema/product) Offer Schema. Should be a valid currency code, i.e `AUD`

- **debug**: `boolean`

  - **default**: `false`

  Will enable debug logs to be shown.
