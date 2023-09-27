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

/**
 * Generate PostgreSQL WHERE clause conditions based on a list of filters.
 *
 * @param {Array} filters - An array of filter objects with column, condition, and value properties.
 * @returns {string} - A string representing the WHERE clause conditions for PostgreSQL queries.
 */
function filterQueryFactoryPostgres(filters) {
  /**
   * Factory function to create individual filter conditions.
   *
   * @param {Object} filter - A filter object with column, condition, and value properties.
   * @param {number} index - The index of the filter in the filters array.
   * @returns {string} - A string representing an individual filter condition.
   */
  function factory(filter, index) {
    // Set the operator (e.g., WHERE) for the first filter, otherwise use the specified operator.
    filter.operator = index ? filter.operator : 'WHERE';
    const { column, condition, value, operator } = filter;

    // Define conditions for non-date columns
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

    // Define conditions for date columns
    const dateConditions = {
      is: `${operator} ${column} = '${value}'`,
      isAfter: `${operator} ${column} > '${value}'`,
      isBefore: `${operator} ${column} < '${value}'`,
      isNot: `${operator} ${column} != '${value}'`,
      empty: `${operator} ${column} IS NULL`,
      notEmpty: `${operator} ${column} IS NOT NULL`,
    };

    // Check if the condition is a date condition, and use the appropriate conditions object
    const selectedConditions = dateConditions[condition] || conditions[condition];

    return selectedConditions;
  }

  // Join the individual filter conditions with the specified operator (e.g., AND)
  return filters.map(factory).join(' ');
}

/**
 * Generate MongoDB query conditions based on a list of filters.
 *
 * @param {Array} filters - An array of filter objects with column, condition, and value properties.
 * @returns {Object} - A MongoDB query object representing the filter conditions.
 */
function filterQueryFactoryMongo(filters) {
  const mongoFilters = [];

  for (const filter of filters) {
    if (filter && filter.column && filter.condition && filter.value !== undefined) {
      const { column, condition, value } = filter;
      const filterObject = {};

      // Map filter conditions to MongoDB operators
      switch (condition) {
        case 'empty':
          filterObject[column] = { $eq: null };
          break;
        case 'lessThan':
          filterObject[column] = { $lt: value };
          break;
        case 'notEmpty':
          filterObject[column] = { $ne: null };
          break;
        case 'isEqualTo':
          filterObject[column] = value;
          break;
        case 'notEqualTo':
          filterObject[column] = { $ne: value };
          break;
        case 'greaterThan':
          filterObject[column] = { $gt: value };
          break;
        case 'isExactly':
          filterObject[column] = value;
          break;
        case 'endsWith':
          filterObject[column] = { $regex: `.*${value}$` };
          break;
        case 'contains':
          filterObject[column] = { $regex: `.*${value}.*` };
          break;
        case 'startsWith':
          filterObject[column] = { $regex: `^${value}.*` };
          break;
        case 'lessThanEqualTo':
          filterObject[column] = { $lte: value };
          break;
        case 'greaterThanEqualTo':
          filterObject[column] = { $gte: value };
          break;
        case 'doesNotContain':
          filterObject[column] = { $not: { $regex: `.*${value}.*` } };
          break;
        // Handle date conditions
        case 'isAfter':
          filterObject[column] = { $gt: new Date(value) };
          break;
        case 'isBefore':
          filterObject[column] = { $lt: new Date(value) };
          break;
        case 'isOn':
          const startDate = new Date(value);
          const endDate = new Date(value);
          endDate.setDate(endDate.getDate() + 1); // Create a range for the whole day
          filterObject[column] = { $gte: startDate, $lt: endDate };
          break;
        default:
          console.error(`Unsupported condition: ${condition}`);
      }

      mongoFilters.push(filterObject);
    } else {
      // Handle invalid filter objects or missing properties
      console.error('Invalid filter object:', filter);
    }
  }

  if (mongoFilters.length > 0) {
    return { $and: mongoFilters };
  } else {
    return {}; // No valid conditions, return an empty filter
  }
}

// Export the function so it can be used in other modules
module.exports = {
  getUniqueValues,
  generateId,
  filterQueryFactoryPostgres,
  filterQueryFactoryMongo,
};
