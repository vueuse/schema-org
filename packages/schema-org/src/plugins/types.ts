export interface SchemaOrgPluginOptions {
  /**
   * Root directory
   */
  root?: string
  /**
   * Whether the tsconfig.json should be updated with the aliases.
   */
  dts?: boolean
  /**
   * Should the runtime be swapped out with a mock one, used for SSR-only mode.
   */
  mock?: boolean
  /**
   * Whether to use schema-dts types on define functions.
   */
  full?: boolean
}
