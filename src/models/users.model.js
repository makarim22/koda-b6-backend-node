/**
 * Creates a User Model with CRUD operations and pagination support
 * Uses closure pattern to maintain private state (users array and nextId counter)
 * 
 * @returns {Object} User model object with methods for managing users
 * 
 * @example
 * const userModel = createUserModel();
 * const newUser = userModel.create({ name: 'John', email: 'john@example.com' });
 */
function createUserModel() {
  let users = [];
  let nextId = 1;

  return {

        /**
     * Creates a new user and adds it to the users array
     * 
     * @param {Object} userData - User data object
     * @param {string} userData.name - User's full name
     * @param {string} userData.email - User's email address
     * @returns {Object} The created user object with auto-generated id
     * 
     * @example
     * const user = userModel.create({ name: 'John Doe', email: 'john@example.com' });
     * // Returns: { id: 1, name: 'John Doe', email: 'john@example.com' }
     */
    create(userData) {
      const user = {
        id: nextId++,
        name: userData.name,
        email: userData.email
      };
      users.push(user);
      return user;
    },

     /**
     * Retrieves all users with pagination support
     * 
     * @param {number} [page=1] - Page number (1-indexed)
     * @param {number} [limit=10] - Number of users per page
     * @returns {Object} Paginated response object
     * @returns {Array} return.data - Array of user objects for the current page
     * @returns {number} return.totalUser - Total number of users in database
     * @returns {number} return.currentPage - Current page number
     * @returns {number} return.limit - Limit per page
     * @returns {number} return.totalPages - Total number of pages
     * 
     * @example
     * const result = userModel.getAll(1, 10);
     * // Returns: {
     * //   data: [...],
     * //   totalUser: 25,
     * //   currentPage: 1,
     * //   limit: 10,
     * //   totalPages: 3
     * // }
     */
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

    /**
     * Retrieves a single user by their ID
     * 
     * @param {number} id - The user's unique identifier
     * @returns {Object|undefined} The user object if found, undefined otherwise
     * 
     * @example
     * const user = userModel.getById(1);
     * // Returns: { id: 1, name: 'John Doe', email: 'john@example.com' }
     */
    getById(id) {
      return users.find((user) => user.id === id);
    },

    /**
     * Updates a user's information by ID
     * Only updates provided fields, preserves existing values for omitted fields
     * 
     * @param {number} id - The user's unique identifier
     * @param {Object} userData - Updated user data object
     * @param {string} [userData.name] - Updated user name (optional)
     * @param {string} [userData.email] - Updated user email (optional)
     * @returns {Object|null} The updated user object if found, null if user doesn't exist
     * 
     * @example
     * const user = userModel.update(1, { name: 'Jane Doe' });
     * // Returns: { id: 1, name: 'Jane Doe', email: 'john@example.com' }
     */
    update(id, userData) {
      const user = this.getById(id);
      if (!user) return null;
      user.name = userData.name || user.name;
      user.email = userData.email || user.email;
      return user;
    },

     /**
     * Deletes a user by their ID
     * 
     * @param {number} id - The user's unique identifier
     * @returns {boolean} True if user was deleted, false if user not found
     * 
     * @example
     * const success = userModel.delete(1);
     * // Returns: true (if user with id 1 existed)
     */

    delete(id) {
      const index = users.findIndex((user) => user.id === id);
      if (index === -1) return false;
      users.splice(index, 1);
      return true;
    }
  };
}

export default createUserModel();