# Debugging Schema.org

Once you've set up your Schema code,
it's important to see what code is being generated, so you could validate the output.

[[toc]]

## Inspect HTML Source

The quickest way to debug the output is simply right click + inspect element and look through the `head` until you find the
`<script type="application/ld+json">` tag.

![HTML Inspect of Schema.org](/html-source.png)


## Component: SchemaOrgInspector

If you'd like something inline, then you can use the `SchemaOrgInspector` component. If you're using auto-imports then
you'll be able to access it straight away.

Simply paste in the code to your template file to see the debugging output. Make sure you remove this before 
pushing to production!

```vue
<template>
<div>
  <h1>Hi</h1>
  <SchemaOrgInspector />
</div>
</template>
```

Now you can visually see the output. The component will also `console.log` the graph for you.

Here's a preview:

<SchemaOrgInspector />


## Third Party Validators

To confirm the schema generated is valid, you should run it through both https://validator.schema.org/ and https://search.google.com/test/rich-results. 


