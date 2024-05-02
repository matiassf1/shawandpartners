import express from 'express'; // Import express as default
import cors from 'cors'; // Import cors as default
import fileRoutes from './routes/fileRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;
