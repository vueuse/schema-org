# Custom Schema

When building a complex Schema, you may come across certain limitations with the package.

In these cases, you are able to provide the entire Schema as you would in a regular script tag.

It's important to note that using custom Schema will mean
you can't make use of [Global Resolves](/guide/how-it-works.html#global-resolves).

## Example

```vue
<script setup lang="ts">
useSchemaOrg([
  {
    "@type": "Event",
    "@id": 'https://example.com/about#event',
    "name": "The Adventures of Kira and Morrison",
    "startDate": "2025-07-21T19:00-05:00",
    "endDate": "2025-07-21T23:00-05:00",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "image": [
      "https://example.com/photos/1x1/photo.jpg",
      "https://example.com/photos/4x3/photo.jpg",
      "https://example.com/photos/16x9/photo.jpg"
    ],
    "description": "The Adventures of Kira and Morrison is coming to Snickertown in a can't miss performance.",
    "offers": {
      "@type": "Offer",
      "url": "https://www.example.com/event_offer/12345_201803180430",
      "price": "30",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": "2024-05-21T12:00"
    },
    "performer": {
      "@type": "PerformingGroup",
      "name": "Kira and Morrison"
    },
    "organizer": {
      "@type": "Organization",
      "name": "Kira and Morrison Music",
      "url": "https://kiraandmorrisonmusic.com"
    }
  }
])
</script>
```
