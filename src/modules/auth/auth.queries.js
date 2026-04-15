export const createUserQuery = `
INSERT INTO users (name, email, password,  phone, address, city, state) 
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING id, name, email, phone, address, city, state;
`
export const findUserByEmailQuery = `
SELECT id FROM users WHERE email = $1;
`
export const findUserById = `
SELECT * FROM users WHERE id = $1;
`
