const {nanoid} = require('nanoid')
const notes = require('./notes');


//!!! Fungsi Untuk Mengisi Data Notes
const addNoteHandler = (request, h)=>{
    //!!! ISI DATA REQUEST
    // {
    //     id: string,
    //     title: string,
    //     createdAt: string,
    //     updatedAt: string,
    //     tags: array of string,
    //     body: string,
    // },

    //TODO 1 Untuk mendapatakan request data body
    const {title, tags, body} = request.payload;

    //TODO 2 Bikin Unik ID pake Nonoid
    const id  = nanoid(16);

    //TODO 3 Bikin data waktu saat note dibuat dan diedit
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    //TODO 4 susun datanya
    const newNote = {
        title, tags, body, id, createdAt, updatedAt,
    }

    //TODO 5 Masukin ke array
    notes.push(newNote);


    //!! Mengetahui data suda masuk dengan membandingkan data id notes lama dengan data id yang baru di input
    const isSuccess = notes.filter((note) => note.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Catatan berhasil ditambahkan',
          data: {
            noteId: id,
          },
        });
        response.header('Access-Control-Allow-Origin', 'http://notesapp-v1.dicodingacademy.com');
        response.code(201);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
      });
      response.header('Access-Control-Allow-Origin', 'http://notesapp-v1.dicodingacademy.com');
      response.code(500);
      return response;
};


//!!! Fungsi Untuk Mendapatkan Data Notes
const getAllNotesHandler = () => ({
    status: 'success',
    data: {
      notes,
    },
});

//!!! Fungsi Mendapatkan Note dengan ID
const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const note = notes.filter((dataNote) => dataNote.id === id)[0];

    if (note !== undefined) {
        return {
          status: 'success',
          data: {
            note,
          },
        };
      }
      const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
      });
      response.code(404);
      return response;
};


// !!! Fungsi Mengedit Note
const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    //!!! Ngambil data notes dengan id yang sama
    const index = notes.findIndex((note) => note.id === id)

    if(index !== -1){
        //!!! replace data lama dengan data baru sesuai id
        notes[index]={
            ...notes[index],
            title,
            tags,
            body,
            updatedAt
        }
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui',
          });
          response.code(200);
          return response;
    }


    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan',
      });
      response.code(404);
      return response;
    
};




const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;
   
    const index = notes.findIndex((note) => note.id === id);


    if (index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
          status: 'success',
          message: 'Catatan berhasil dihapus',
        });
        response.code(200);
        return response;
      }
     
     const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan',
      });
      response.code(404);
      return response;
  };
module.exports = {addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler};