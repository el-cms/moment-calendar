### Usage

```jsx
const moment = require("moment") // use import; I can't in the doc.

const events = [
  { type: 'event', title: 'Full day event', startDate: moment().hour(10), endDate: moment().hour(12), fullDay: true },
  { type: 'event', title: 'Some nice event', startDate: moment().hour(10), endDate: moment().hour(12) },
  { type: 'event', title: 'A very long event', startDate: moment().hour(10), endDate: moment().add(1, 'day').hour(10) },
  { type: 'task', title: 'My first task', dueDate: moment().hour(15) }
]
<calendar-view-day :events="events" />
```
