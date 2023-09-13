/**
 * Get unique values from an array of objects based on a specified field.
 *
 * @param {Array} data - The array of objects to extract unique values from.
 * @param {string} field - The field in each object to extract unique values from.
 * @returns {Array} An array containing unique values from the specified field.
 */
function getUniqueValues(data, field) {
  // Check if 'data' is an array and 'field' is a string
  if (!Array.isArray(data) || typeof field !== 'string') {
    return [];
  }

  // Use 'map' to extract values from the specified 'field'
  const values = data.map((item) => item[field]);

  // Use the 'Set' constructor to get unique values and convert back to an array
  return [...new Set(values)];
}

/**
 * Create new data by adding an object to an existing array.
 *
 * @param {Array} array - The existing array of objects.
 * @param {Object} newObject - The object to add to the array.
 * @returns {Array} A new array containing the existing data plus the new object.
 */
function createData(array, newObject) {
  // Check if 'array' is an array and 'newObject' is an object
  if (!Array.isArray(array) || typeof newObject !== 'object') {
    return [];
  }

  // Return a new array containing the existing data and the new object
  return [...array, newObject];
}

/**
 * Update an object in an array based on its ID.
 *
 * @param {Array} array - The array of objects to update.
 * @param {string} id - The ID of the object to update.
 * @param {Object} data - The new data to update the object with.
 * @returns {Array} A new array with the updated object, or the original array if the ID is not found.
 */
function updateData(array, id, data) {
  // Check if 'array' is an array and 'data' is an object
  if (!Array.isArray(array) || typeof data !== 'object') {
    return [];
  }

  // Use 'map' to update the object with the matching ID
  return array.map((item) => (item.id === id ? { ...item, ...data } : item));
}

/**
 * Delete an object from an array based on its ID.
 *
 * @param {Array} array - The array of objects to delete from.
 * @param {string} id - The ID of the object to delete.
 * @returns {Array} A new array with the specified object removed, or the original array if the ID is not found.
 */
function deleteData(array, id) {
  // Check if 'array' is an array
  if (!Array.isArray(array)) {
    return [];
  }

  // Use 'filter' to remove the object with the matching ID
  return array.filter((item) => item.id !== id);
}

/**
 * Generate a unique ID of the specified type.
 *
 * @param {string} type - The type of ID to generate ('random' or 'uuid').
 * @param {number} length - The length of the ID (only applicable for 'random' type).
 * @returns {string|null} A unique ID or null if an invalid type is provided.
 */
function generateId(type, length = 10) {
  let id;

  switch (type) {
    case 'random':
      let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let charactersLength = characters.length;
      id = '';
      for (let i = 0; i < length; i++) {
        id += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      break;

    case 'uuid':
      id = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
      );
      break;

    default:
      return null;
  }

  return id.toString();
}

function filterQueryFactoryPostgres(filters) {
  function factory(filter, index) {
    filter.operator = index ? filter.operator : 'WHERE';
    const { column, condition, value, operator } = filter;
    const conditions = {
      empty: `${operator} ${column} IS NULL`,
      lessThan: `${operator} ${column} < ${value}`,
      notEmpty: `${operator} ${column} IS NOT NULL`,
      isEqualTo: `${operator} ${column} = ${value}`,
      notEqualTo: `${operator} ${column} != ${value}`,
      greaterThan: `${operator} ${column} > ${value}`,
      isExactly: `${operator} ${column} = '${value}'`,
      endsWith: `${operator} ${column} LIKE '%${value}'`,
      contains: `${operator} ${column} LIKE '%${value}%'`,
      startsWith: `${operator} ${column} LIKE '${value}%'`,
      lessThanEqualTo: `${operator} ${column} <= ${value}`,
      greaterThanEqualTo: `${operator} ${column} >= ${value}`,
      doesNotContain: `${operator} ${column} NOT LIKE '%${value}%'`,
    };
    return conditions[condition];
  }
  return filters.map(factory).join(' ');
}

// Export the function so it can be used in other modules
module.exports = {
  getUniqueValues,
  createData,
  updateData,
  deleteData,
  generateId,
  filterQueryFactoryPostgres,
};
