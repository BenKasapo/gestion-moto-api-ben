const prisma = require('../models/prismaClient');

const generateUniqueCode = async () => {
  const date = new Date();
  const monthYear = `${date.getDate().toString().padStart(2, '0')}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getFullYear()}`;
  const prefix = 'KYC';
  let code;
  let isUnique = false;

  while (!isUnique) {
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    code = `${prefix}-${monthYear}-${randomString}`;

    const existingCode = await prisma.utilisateur.findUnique({ where: { code } });
    if (!existingCode) isUnique = true;
  }

  return code;
};

module.exports = generateUniqueCode;
