import amqp from 'amqplib';

const init = async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queue = 'dicoding';

  await channel.assertQueue(queue, {
    durable: true,
  });

  channel.consume(
    queue,
    (message) => {
      if (!message) {
        return;
      }

      console.log(`Menerima pesan dari queue ${queue}: ${message.content.toString()}`);
    },
    { noAck: true },
  );
};

init().catch((error) => {
  console.error('Gagal menerima pesan:', error);
  process.exit(1);
});
