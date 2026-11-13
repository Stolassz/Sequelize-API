jest.mock('nodemailer', () => ({
  __esModule: true,
  default: {
    createTransport: jest.fn(() => ({
      sendMail: jest.fn().mockResolvedValue(true)
    }))
  }
}));

describe('emailService', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.EMAIL_USERNAME = 'gtbezerra@gmail.com';
    process.env.EMAIL_PASSWORD = 'senha123';
  });

  it('deve enviar e-mail de verificação com sucesso', async () => {
    const nodemailer = require('nodemailer');
    const { sendVerificationEmail } = require('../../utils/emailService');

    const enviado = await sendVerificationEmail('user@email.com', '123456');

    expect(enviado).toBe(true);
    expect(nodemailer.default.createTransport).toHaveBeenCalled();
  });
});
