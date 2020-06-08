import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as cors from 'cors'
import * as helmet from 'helmet'

import temasRoutes from './routes/temas'
import librosPendientesRoutes from './routes/libros-pendientes'
import fabricantesRoutes from './routes/fabricantes'
import idiomasRoutes from './routes/idiomas'
import tutorialesPendientesRoutes from './routes/tutoriales-pendientes'
import editorialesRoutes from './routes/editoriales'
import librosRoutes from './routes/libros'
import tutorialesRoutes from './routes/tutoriales'

const PORT = process.env.PORT || 3001

const server = createConnection().then(() => {    
    const app = express();

    app.use(express.json())
    app.use(cors())
    app.use(helmet())

    app.use('/api', temasRoutes)   
    app.use('/api', idiomasRoutes)   
    app.use('/api', librosPendientesRoutes)
    app.use('/api', fabricantesRoutes)
    app.use('/api', tutorialesPendientesRoutes)
    app.use('/api', editorialesRoutes)
    app.use('/api', librosRoutes)
    app.use('/api', tutorialesRoutes)
    
    app.listen(PORT, () => console.log(`Server http://localhost:${PORT} running ...`))
}).catch(error => console.log(error));

export default server


