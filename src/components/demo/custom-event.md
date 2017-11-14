### Usage

```jsx
const moment = require("moment") // use import; I can't in the doc.

const data = { type: 'event', title: 'Some nice event', startDate: moment().hour(10), endDate: moment().hour(12) }
<custom-widget-event :data="data" />
```
