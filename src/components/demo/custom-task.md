### Usage

```jsx
const moment = require("moment") // use import; I can't in the doc.

const data = { type: 'task', title: 'My first task', dueDate: moment().hour(15) }

<custom-widget-task :data="data" />
```
