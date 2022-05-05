# Debugging Schema.org

Once you've set up your sites Schema, 
it's important to see what code is being generated, so you can validate it.

[[toc]]

## Component: SchemaOrgInspector

The `SchemaOrgInspector` component is provided to quickly and visually debug the Schema on your page.

Add the component to your template to see the debugging output. It will also `console.debug` the current nodes.

Note: Make sure you remove this before pushing to production!

```vue
<template>
<div>
  <!-- ... -->
  <SchemaOrgInspector />
</div>
</template>
```

Now you can visually see the output.

Want to see what it looks like? Scroll down, it's embedded on every page of these docs.


## Inspect HTML Source

The quickest way to debug the output is simply right click + inspect element and look through the `head` until you find the
`<script type="application/ld+json">` tag.

![HTML Inspect of Schema.org](/html-source.png)

## Third Party Validators

To confirm the schema generated is valid, you should run it through both https://validator.schema.org/ and https://search.google.com/test/rich-results. 


