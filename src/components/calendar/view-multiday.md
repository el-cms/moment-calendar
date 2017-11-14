### Usage

```jsx
const moment = require("moment") // use import; I can't in the doc.

const data = {
  'Frankenstein': [
    { type: 'event', title: 'Creation date', startDate: moment().hour(10), endDate: moment().hour(12), fullDay: true },
    { type: 'event', title: 'Groceries', startDate: moment().hour(10), endDate: moment().hour(12) },
    { type: 'event', title: 'Socialize', startDate: moment().hour(10), endDate: moment().add(1, 'day').hour(10) },
    { type: 'task', title: 'Cleanup', dueDate: moment().hour(15) },
    { type: 'event', title: 'Celebrate', startDate: moment().hour(20), endDate: moment().hour(23) }
  ],
  'Dracula': [
    { type: 'event', title: 'Frankenstein\'s bDay !', startDate: moment().hour(10), endDate: moment().hour(12), fullDay: true },
    { type: 'event', title: 'Celebrate', startDate: moment().hour(20), endDate: moment().hour(23) },
    { type: 'event', title: 'Get some rest', startDate: moment().hour(6), endDate: moment().hour(18) },
    { type: 'task', title: 'Brush teeth', dueDate: moment().hour(19) }
  ],
}
<calendar-view-multiday :data="data" />
```
