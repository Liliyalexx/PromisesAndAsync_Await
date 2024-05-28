// Importing database functions. DO NOT MODIFY THIS LINE.
import { central, db1, db2, db3, vault } from "./databases.mjs";

async function getUserData(id) {
  const dbs = {
    db1: db1,
    db2: db2,
    db3: db3
  };

  try {
    //Get the database identifier from the central database

    const dbIdentifier = await central(id);
    // const userData = dbs[dbIdentifier](id);
    const [userData, personalData] = await Promise.all([
        dbs[dbIdentifier](id),
        vault(id)// Part 2
      ]);
    // const personalData = await vault(id);

    const combinedData = {
        id: id,
        name: personalData.name,
        username: userData.username,
        email: personalData.email,
        address: {
          street: personalData.address.street,
          suite: personalData.address.suite,
          city: personalData.address.city,
          zipcode: personalData.address.zipcode,
          geo: {
            lat: personalData.address.geo.lat,
            lng: personalData.address.geo.lng
          }
        },
        phone: personalData.phone,
        website: userData.website,
        company: {
          name: userData.company.name,
          catchPhrase: userData.company.catchPhrase,
          bs: userData.company.bs
        }
      };

      return combinedData;

  } catch(error){
    return Promise.reject(error);
  }
}
// Example usage:
getUserData(1)
  .then(data => console.log(data))
  .catch(error => console.error(error));

//Testing
  const testIds = [1, 5, 10, -1, 11, 'a', true];

testIds.forEach(id => {
  getUserData(id)
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error));
});