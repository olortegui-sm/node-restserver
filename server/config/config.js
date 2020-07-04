// ========================
//puerto
//=========================

process.env.PORT = process.env.PORT || 3000;


//=========================
//entorno
//=========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=========================
//base de datos
//=========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://manu:hCIsM4bwEcLad6jc@cluster0.iqxbo.mongodb.net/cafe';
}

process.env.URLDB = urlDB;