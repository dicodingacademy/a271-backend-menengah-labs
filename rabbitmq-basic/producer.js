import amqp from 'amqplib';

const init = async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queue = 'dicoding';
  const message = 'Selamat belajar message broker!';

  await channel.assertQueue(queue, {
    durable: true,
  });

  await channel.sendToQueue(queue, Buffer.from(message));
  console.log('Pesan berhasil terkirim!');

  setTimeout(async () => {
    await channel.close();
    await connection.close();
  }, 1000);
};

init().catch((error) => {
  console.error('Gagal mengirim pesan:', error);
  process.exit(1);
});
