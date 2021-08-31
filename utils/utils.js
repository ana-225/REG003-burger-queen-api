module.exports.pagination = (response, url, page, limit, totalPages) => {
  const linkHeader = {
    first: `${url}?limit=${limit}&page=1`,
    prev: response.hasPrevPage ? `${url}?limit=${limit}&page=${page - 1}` : `${url}?limit=${limit}&page=${page}`,
    next: response.hasNextPage ? `${url}?limit=${limit}&page=${page + 1}` : `${url}?limit=${limit}&page=${page}`,
    last: `${url}?limit=${limit}&page=${totalPages}`,
  };

  return linkHeader;
};
module.exports.isEmailOrID = (params) => {
  if (params.indexOf('@') === -1) {
    const uid = { _id: params };
    return uid;
  }
  const email = { email: params };
  return email;
};
module.exports.isAValidEmail = (email) => {
  const emailRegex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i
  if (emailRegex.test(email)) {
    return true;
  }
  return false;
};
module.exports.isAValidPassword = (password) => {
  if (password.length < 5) {
    return false;
  }
  return true;
};
module.exports.verifyRoles = (update) => {
  let updateObject = update;
  if (!update.roles) {
    updateObject = {
      email: update.email,
      password: update.password,
      roles: {
        admin: false,
      },
    };
  }
  return updateObject;
};
