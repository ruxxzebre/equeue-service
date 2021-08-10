const ipconfig = {
  // ip: process.env.BASE_URL || "http://localhost:3000/api",
  ip: "http://localhost:3000/api",
};
const secured = {
  // md5('password') -> 5f4dcc3b5aa765d61d8327deb882cf99
  passwordHash: "5f4dcc3b5aa765d61d8327deb882cf99",
};

module.exports.ipconfig = ipconfig;
module.exports.secured = secured;
