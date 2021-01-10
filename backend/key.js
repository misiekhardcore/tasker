const bcrypt = require("bcrypt");

const key = async () => {
  const a = await bcrypt.hash("user" + "user@user.com", 2);
  console.log(a);
};
key();
