export const getMybooking = ` select * from seats where user_id = $1  AND isbooked = 1;`;
