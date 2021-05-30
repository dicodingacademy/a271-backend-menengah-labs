const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
  });

  server.route({
    method: 'POST',
    path: '/uploads',
    handler: async (request) => {
      // mendapatkan dan melihat nilai request.payload.data
      const { data } = request.payload;
      console.log(data);

      // menentukan nama dan folder berkas
      const filename = data.hapi.filename;
      const directory = path.resolve(__dirname, 'uploads');
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory); // membuat folder bila belum ada
      }

      // membuat writable stream
      const location =  `${directory}/${filename}`;
      const fileStream = fs.createWriteStream(location);

      try {
        const result = await new Promise((resolve, reject) => {
          // mengembalikan Promise.reject ketika terjadi eror
          fileStream.on('error', (error) => reject(error));

          // membaca Readable (data) dan menulis ke Writable (fileStream)
          data.pipe(fileStream);

          // setelah selesai membaca Readable (data) maka mengembalikan nama berkas.
          data.on('end', () => resolve(filename));
        });

        return { message: `Berkas ${result} berhasil diproses!` };
      } catch (error) {
        return { message: `Berkas gagal diproses` };
      }
    },
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 500000, // 500KB
      },
    },
  });

  await server.start();
  console.log(`Server start at ${server.info.uri}`);
};

init();
