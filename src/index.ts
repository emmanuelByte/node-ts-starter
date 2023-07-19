import app from './app';
import config from './config/config';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import color from 'colors';
import { connect } from './infra/db/mongoose/models';
const port = config.app.port;
import listEndPoints from 'list_end_points';

// Connect to MongoDB
connect()
  .then(() => {
    app.listen(port, () => {
      listEndPoints(app);

      console.log(`Server running on port ${port}`.green);
    });
  })
  .catch((err) => {
    console.log(err);
  });
