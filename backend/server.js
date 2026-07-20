const { PORT } = require('./config');
const app = require('./app');

app.listen(PORT, () => console.log(`HDDP backend running on http://localhost:${PORT}`));
