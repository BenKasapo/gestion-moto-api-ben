const bcrypt = require('bcrypt');
const { findUserByMailOrPhone, updateUserPassword, find_UserByMailOrPhone }= require( '../database/requests.js');

 const resetPassword = async (req, res) => {
  const { email, phone1, newPassword } = req.body;
  console.log('Received reset password request for email:', email, 'and phone1:', phone1); // Debug log

 /*  if (!email  || !phone1) {
    return res.status(400).json({ message: 'Email or phone number is required' });
  } */

  try {
    const user = await find_UserByMailOrPhone(email, phone1);
    console.log('User found:', user); // Debug log

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