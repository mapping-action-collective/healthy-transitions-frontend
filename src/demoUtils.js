// list of 100 largest cities/towns in Oregon, from Wikipedia
// TODO: finish this list to include ALL Oregon cities/towns
const cities = ['Portland', 'Eugene', 'Salem', 'Gresham', 'Hillsboro', 'Bend', 'Beaverton', 'Medford', 'Springfield', 'Corvallis', 'Albany', 'Tigard', 'Lake Oswego', 'Keizer', 'Grants Pass', 'Oregon City', 'McMinnville', 'Redmond', 'Tualatin', 'West Linn', 'Wilsonville', 'Forest Grove', 'Woodburn', 'Newberg', 'Happy Valley', 'Roseburg', 'Klamath Falls', 'Ashland', 'Milwaukie', 'Sherwood', 'Hermiston', 'Central Point', 'Lebanon', 'Canby', 'Pendleton', 'Dallas', 'Troutdale', 'The Dalles', 'Coos Bay', 'St. Helens', 'La Grande', 'Cornelius', 'Sandy', 'Gladstone', 'Ontario', 'Monmouth', 'Prineville', 'Cottage Grove', 'Silverton', 'Fairview', 'North Bend', 'Newport', 'Mololla', 'Astoria', 'Baker City', 'Independence', 'Sweet Home', 'Lincoln City', 'Eagle Point', 'Florence', 'Sutherlin', 'Hood River', 'Stayton', 'Scappoose', 'Madras', 'Umatilla', 'Milton-Freewater', 'Seaside', 'Junction City', 'Brookings', 'Talent', 'Warrenton', 'Creswell', 'Winston', 'Philomath', 'Veneta', 'Tillamook', 'King City', 'Sheridan', 'Pheonix', 'Lafayette', 'Wood Village', 'Estacada', 'Reedsport', 'Aumsville', 'Coquille', 'Boardman', 'Harrisburg', 'Toledo', 'Myrtle Creek', 'North Plains', 'Hubbard', 'Mt. Angel', 'Jefferson', 'Bandon', 'Dundee', 'Oakridge', 'Nysssa', 'Shady Cove', 'Sisters', 'Jacksonville', 'Sublimity', 'Millersburg', 'Burns', 'Dayton', 'Gervais', 'La Pine', 'Myrtle Point']

// This runs on the HT server, but it's here for demo purposes when we demo sites like White Bird
// Only run this once, since it's expensive. After the initial render, use the regular "getCityCount" function in utils.js
export const getCityCountDemo = listings => {
  let cityCount = {}
  cities.forEach((e) => cityCount[e] = 0)
    listings.forEach((listing) => {
    cities.forEach((city) => {
      if (listing.address?.toLowerCase().includes(city.toLowerCase())) {
        cityCount[city] ++
      }
    })
  })
  // Filter out cities with no entries
  return Object.fromEntries(Object.entries(cityCount).filter(([k, v]) => v !== 0))
}