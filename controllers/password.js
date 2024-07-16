const bcrypt = require('bcrypt');
const { findUserByMailOrPhone, updateUserPassword }= require( '../database/requests.js');

 const resetPassword = async (req, res) => {
  const { email, phone1, newPassword } = req.body;

  try {
    const user = await findUserByMailOrPhone(email, phone1);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const identifier = email ? { email } : { phone1 };
    await updateUserPassword(identifier, hashedPassword);

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { resetPassword }