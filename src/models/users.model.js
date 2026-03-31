function createUserModel() {
  let users = [];
  let nextId = 1;

  return {
    create(userData) {
      const user = {
        id: nextId++,
        name: userData.name,
        email: userData.email
      };
      users.push(user);
      return user;
    },

    getAll(page = 1, limit = 10) {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedUsers = users.slice(start, end);
  
  return {
    data: paginatedUsers,
    totalUser: users.length,
    currentPage : page,
    limit,
    totalPages: Math.ceil(users.length / limit)
  };
},

    getById(id) {
      return users.find((user) => user.id === id);
    },

    update(id, userData) {
      const user = this.getById(id);
      if (!user) return null;
      user.name = userData.name || user.name;
      user.email = userData.email || user.email;
      return user;
    },

    delete(id) {
      const index = users.findIndex((user) => user.id === id);
      if (index === -1) return false;
      users.splice(index, 1);
      return true;
    }
  };
}

export default createUserModel();