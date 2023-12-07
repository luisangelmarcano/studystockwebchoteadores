const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { ApolloServer, gql } = require('apollo-server-express');
const Usuario = require('./models/usuario');
const Perfil = require('./models/perfil');
const Producto = require('./models/producto');
const Solicitud = require('./models/solicitudes');
const Prestamo = require('./models/prestamos');
const Ticket = require('./models/ticket');
const productoRoutes = require('./productoRoutes');
const storage = multer.diskStorage({
  destination: 'StudyStock/imagenes', // Ruta donde se guardarán las imágenes
  filename: function (req, file, cb) {
    // Verificar si el objeto de archivo y su propiedad 'originalname' existen
    if (file && file.originalname) {
      cb(null, file.originalname); // Usar el nombre original del archivo
    } else {
      // Manejar el error, por ejemplo, proporcionar un nombre predeterminado
      cb(new Error('Error al obtener el nombre del archivo'), 'default-filename.jpg');
    }
  }
});
const upload = multer({ storage: storage });
mongoose.connect('mongodb+srv://studystock:1234@studystock.j50k4cy.mongodb.net/dbstudystock', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const typeDefs = gql`
  type Solicitud {
    id: ID!
    estado: String
    ticket: Ticket
    fechaDevuelta: String
  }
  input CrearSolicitudInput {
    ticket: String!
  }
  input AprobarSolicitudInput {
    id: ID!
  }
  
  type Ticket {
    id: ID!
    producto: Producto
    usuario: Usuario
    fecha: String
  }
  
  input TicketInput {
    usuario: String!
    producto: String!
  }

  type Prestamo {
    id: ID!
    solicitud: Solicitud
    
  }

  type Perfil {
    id: ID!
    nombre: String!
    permisos: [String]
  }

  input PerfilInput {
    nombre: String!
    permisos: [String]
  }

  type Reporte {
    id: ID!
    prestamos: [Prestamo]
    producto: [Producto] 
    usuarios: [Usuario] 
    stockDisponible: Int
    stockNoDisponible: Int
    productoMasSolicitado: Producto
    productoMenosSolicitado: Producto
    devolucionesFueraDePlazo: [Prestamo]
    productosConPerdidas: [Producto]
  }
  type Usuario {
    id: ID!
    rut: String!
    pass: String!
    nombre: String!
    apellido1: String
    apellido2: String
    carrera: String
    telefono: String
    correo: String
    perfil: Perfil
  }

  type Producto {
    id: ID!
    nombreproducto: String!
    categoria: String!
    autor: String
    editorial: String
    detalle: String
    imagen: String
  }

  input UsuarioInput {
    rut: String!
    pass: String!
    nombre: String!
    apellido1: String
    apellido2: String
    carrera: String
    telefono: String
    correo: String
    perfil: String
  }

  input ProductoInput {
    nombreproducto: String!
    categoria: String
    autor: String
    editorial: String
    detalle: String
    imagen: String
  }
  type Alert {
    message: String
  }

  type Query {
    getUsuarios: [Usuario]
    getUsuario(id: ID!): Usuario
    getPerfiles: [Perfil]
    getPerfil(id: ID!): Perfil
    getProductos: [Producto]
    getProducto(id: ID!): Producto
    getSolicitud(id: ID!): Solicitud
    getPrestamo(id: ID!): Prestamo
    getTicket(id: ID!): Ticket
    getTickets: [Ticket]
    getSolicitudes: [Solicitud]
    getPrestamos: [Prestamo]
    getSolicitudesByUsuario(usuarioId: ID!): [Solicitud]
  }

  type Mutation {
    login(rut: String!, pass: String!): String
    addUsuario(input: UsuarioInput): Usuario
    updUsuario(id: ID!, input: UsuarioInput): Usuario
    delUsuario(id: ID!): Alert
    delSolicitudes(id: ID!): Alert
    delTicket(id: ID!): Alert
    addPerfil(input: PerfilInput): Perfil
    updPerfil(id: ID!, input: PerfilInput): Perfil
    delPerfil(id: ID!): Alert
    agregarProducto(input: ProductoInput): Producto
    modificarProducto(id: ID!, input: ProductoInput): Producto
    darDeBajaProducto(id: ID!): Alert
    CrearSolicitud(input: CrearSolicitudInput): Solicitud
    aprobarSolicitud(id: ID!, input: AprobarSolicitudInput): Solicitud
    registrarPrestamo(id: ID!): Prestamo
    registrarDevolucion(id: ID!): Alert
    agregarTicket(input: TicketInput): Ticket
  }
`;

const resolvers = {
  Query: {
    async getPerfiles(obj) {
      const perfiles = await Perfil.find();
      return perfiles.map(perfil => this.getPerfil(obj, { id: perfil.id }));
    },
    async getSolicitudesByUsuario(obj, { usuarioId }) {
      const solicitudes = await Solicitud.find({ 'ticket.usuario.id': usuarioId });
      
      // Iterar sobre las solicitudes y resolver las referencias a Ticket y Usuario
      const solicitudesResueltas = await Promise.all(
          solicitudes.map(async solicitud => {
              solicitud.ticket = await resolvers.Query.getTicket(obj, { id: solicitud.ticket });
              return solicitud;
          })
      );
  
      return solicitudesResueltas;
  },
    async getPerfil(obj, { id }) {
      const perfil = await Perfil.findById(id);
      return perfil;
    },
    async getUsuarios(obj) {
      const usuarios = await Usuario.find();
      return usuarios.map(usuario => this.getUsuario(obj, { id: usuario.id }));
    },
    async getUsuario(obj, { id }) {
      const usuario = await Usuario.findById(id);
      usuario.perfil = await resolvers.Query.getPerfil(obj, { id: usuario.perfil})
      return usuario;
    },
    async getProductos(obj) {
      const productos = await Producto.find();
      return productos.map(producto => this.getProducto(obj, { id: producto.id }));
    },
    async getProducto(obj, { id }) {
      const producto = await Producto.findById(id);
      return producto;
    },
    async getSolicitud(obj, { id }) {
      const solicitud = await Solicitud.findById(id);
      solicitud.ticket = await this.getTicket(obj, { id: solicitud.ticket });
      return solicitud;
    },
    async getSolicitudes(obj) {
      const solicitudes = await Solicitud.find();
      return solicitudes.map(solicitud => this.getSolicitud(obj, { id: solicitud.id }));
    },
    
    
    async getPrestamo(obj, { id }) {
      const prestamo = await Prestamo.findById(id);
      prestamo.solicitud = await this.getSolicitud(obj, { id: prestamo.solicitud });
      return prestamo;
    },
    async getPrestamos(obj) {
      const prestamos = await Prestamo.find();
      return prestamos.map(prestamo => this.getPrestamo(obj, { id: prestamo.id }));
    },
    
    getTicket: async (obj, { id }) => {
      const ticket = await Ticket.findById(id);
      ticket.usuario = await resolvers.Query.getUsuario(obj, { id: ticket.usuario });
      ticket.producto = await resolvers.Query.getProducto(obj, { id: ticket.producto });
      return ticket;
    },
    async getTickets(obj) {
      const tickets = await Ticket.find();
      return tickets.map(ticket => this.getTicket(obj, { id: ticket.id }));
    },
  },
  Mutation: {
    login: async (_, { rut, pass }) => {
      const user = await Usuario.findOne({ rut }).populate('perfil');
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      if (user.pass !== pass) {
        throw new Error('Contraseña incorrecta');
      }
      return jwt.sign({ userId: user.id, perfil: user.perfil.nombre, permisos: user.perfil.permisos, nombre: user.nombre }, 'SECRET_KEY');
    },
    async addUsuario(obj, { input }) {
      const perfil = await Perfil.findById(input.perfil);
      if (!perfil) {
        throw new Error('Perfil no encontrado');
      }
      const usuario = new Usuario({
        ...input,
        Perfil: perfil._id,
      });
      await usuario.save();
      return usuario;
    },
    agregarTicket: async (obj, { input }) => {
      const producto = await Producto.findById(input.producto);
      const usuario = await Usuario.findById(input.usuario);
    
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
    
      if (!producto) {
        throw new Error('Producto no encontrado');
      }
    
      const ticketExistente = await Ticket.findOne({ producto: producto._id });

      if (ticketExistente) {
       
        const solicitudExistente = await Solicitud.findOne({ ticket: ticketExistente._id });

        if (solicitudExistente) {
          
          const prestamoExistente = await Prestamo.findOne({ solicitud: solicitudExistente._id });

          if (prestamoExistente) {
            throw new Error('El producto ya esta en prestamo. No se puede agregar un nuevo ticket');
          }
        }
      }

      const ticket = new Ticket({
        ...input,
        Usuario: usuario._id,
        Producto: producto._id,
      });

      await ticket.save();
      return ticket;
    },
    async agregarProducto(obj, { input }) {
      const producto = new Producto(input);
      await producto.save();
      return producto;
    },
    async addPerfil(obj, { input }) {
      const perfil = new Perfil(input);
      await perfil.save();
      return perfil;
    },
    async updUsuario(obj, { id, input }) {
      const usuario = await Usuario.findByIdAndUpdate(id, input, { new: true });
      return usuario.populate('perfil');
    },
    async modificarProducto(obj, { id, input }) {
      const producto = await Producto.findByIdAndUpdate(id, input, { new: true });
      return producto;
    },
    async darDeBajaProducto(obj, { id }) {
      await Producto.deleteOne({ _id: id });
      return {
        message: 'Producto dado de baja',
      };
    },
    async updPerfil(obj, { id, input }) {
      const perfil = await Perfil.findByIdAndUpdate(id, input);
      return perfil;
    },
    async delPerfil(obj, { id }) {
      await Perfil.deleteOne({ _id: id });
      return {
        message: 'Perfil Eliminado',
      };
    },
    async delTicket(obj, { id }) {
      await Ticket.deleteOne({ _id: id });
      return {
        message: 'Ticket Eliminado',
      };
    },
    async delUsuario(obj, { id }) {
      await Usuario.deleteOne({ _id: id });
      return {
        message: 'Usuario Eliminado',
      };
    },
    async delSolicitudes(obj, { id }) {
      // Obtener la solicitud por su ID
      const solicitud = await Solicitud.findById(id);
  
      // Verificar si el estado es "prestada" o "aceptada"
      if (solicitud.estado === 'prestada' || solicitud.estado === 'aceptada') {
          // Si es así, devolver un mensaje indicando que el producto fue aceptado anteriormente
          return {
              message: 'Este producto fue aceptado anteriormente y no se puede rechazar.',
          };
      }
  
      // Si no, proceder con la eliminación de la solicitud
      await Solicitud.deleteOne({ _id: id });
  
      // Devolver un mensaje indicando que la solicitud fue rechazada
      return {
          message: 'Solicitud borrada',
      };
  },
    CrearSolicitud: async (obj, { input }) => {
      const ticket = await Ticket.findById(input.ticket);
      const solicitud = new Solicitud({
        ...input,
        Ticket: ticket._id,
        estado: 'pendiente',
      });
      await solicitud.save();
      return solicitud;
    },
  
    aprobarSolicitud: async (obj, { id }) => {
      const solicitud = await Solicitud.findByIdAndUpdate(
        id,
        {
          estado: 'aprobada',
        },
        { new: true }
      );
    
      if (solicitud) {
        await resolvers.Mutation.registrarPrestamo({}, { id: solicitud._id });
      }
    
      return solicitud;
    },
    
    registrarPrestamo: async (obj, { id }) => {
      const prestamo = new Prestamo({
        solicitud: id,
      });
    
      await prestamo.save();
      await Solicitud.findByIdAndUpdate(id, { estado: 'prestada' });
    
      return prestamo;
    },
  
    registrarDevolucion: async (obj, { id }) => {
      const prestamo = await Prestamo.findById(id);
      if (!prestamo) {
        throw new Error('Prestamo no encontrado');
      }
    
      const solicitud = await Solicitud.findOne({ _id: prestamo.solicitud });
      if (!solicitud) {
        throw new Error('Solicitud no encontrada');
      }
    
      await Solicitud.findByIdAndUpdate(solicitud._id, { estado: 'Devuelto', fechaDevuelta: new Date() });
    
      await Prestamo.deleteOne({ _id: id });
    
      return {
        message: 'Prestamo Eliminado y Solicitud actualizada a Devuelto',
      };
    },
  }
};

const app = express();

let apolloServer = null;

const corsOptions = {
  origin: 'http://localhost:8091',
  credentials: true,
};

async function startServer() {
  apolloServer = new ApolloServer({ typeDefs, resolvers, cors: corsOptions });
  await apolloServer.start();

  apolloServer.applyMiddleware({ app });
}

startServer();

app.use(cors());
app.post('/subirImagen', upload.single('imagen'), (req, res) => {
  // Comprobar si se subió un archivo
  if (!req.file) {
    console.error('No se subió ningún archivo');
    return res.status(400).send('No se subió ningún archivo');
  }

  // Manejar errores de multer
  if (req.file instanceof Error) {
    console.error('Error al subir el archivo:', req.file);
    return res.status(400).send('Error al subir el archivo');
  }

  const imagePath = path.join('StudyStock/imagenes', req.file.originalname);
  res.send(imagePath);
});




app.use('/producto', productoRoutes);
app.use(
  session({
    secret: 'SECRET_KEY',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);
app.use('/StudyStock/imagenes', express.static('imagenes'));
app.listen(8091, function () {
  console.log('Servidor Iniciado');
});












