// Failsafe in case that API route returns no static site text
const defaultStaticText = {
  "about_text": "The Oregon Youth Resource Map is a collaboration between Healthy Transitions Youth Leadership, youth councils around the state, Direction Service in Eugene, and the Mapping Action Collective in Portland, Oregon. \n The Resource Map centers youth needs and voices. It focuses on programs, services and leadership opportunities for youth and young adults, ages 16-25 in Oregon, including services for health and mental healthcare, housing, education, and more. The Map began as a way to connect youth with mental health services, and has expanded to include anything that may improve quality of life for youth and young adults. \n The Oregon Youth Resource Map is funded and contributed to by SAMHSA (Substance Abuse and Mental Health Service Administration), the Oregon Health Authority, Portland State University, Youth ERA, and local service providers from Douglas and Lane Counties.",
  "resources": [
    {
    "name": "Self Enhancement Inc BIPOC Resource Guide",
    "description": "Searchable website with a wide variety of resources, such as scholarships and internships, educational and job seeker services, and resources for basic needs and community building. The primary focus is resources for Black youth, but the guide also includes a variety of resources for outher BIPOC youth, including Indigenous, Latinx, Pacific Islander, Asian, Middle Eastern, and multiracial children, youth, and adults.",
    "link": "https://www.selfenhancement.org/resource"
    },
    {
    "name": "National Crisis Resources (Crisis Text Line)",
    "description": "List of resources curated & vetted by a national crisis text line service. Resources are all free or low-cost, and available for viewing on mobile phones.",
    "link": "https://www.crisistextline.org/resources/"
    },
    {
    "name": "Q Chat Space Resource List (LGBTQ+ and QTPOC Resources)",
    "description": "Q Chat Space is an online chat space for LGBTQ+ and questioning teens. They maintain a LGBTQ resource list that includes special sections for mental health, Youth of Color, and Trans/Gender Non-Conforming Youth. ",
    "link": "https://www.qchatspace.org/Learn-More"
    },
    {
    "name": "Brave Space Resource Website - LGBTQ Focused",
    "description": "Brave Space creates community and facilitates access to expert and knowledgeable providers for transgender and non-binary children, youth, adults, and their families.\nTheir online resource guide is a place to find information about Brave Space community services, including resources for gender-affirming service providers and content, our free clothing, and community events. \nDescription source: Brave Space's website",
    "link": "https://www.bravespacellc.com/resources"
    },
    {
    "name": "15th Night Resource Guide",
    "description": "Resource list focused on houseless and low income youth in Eugene, Oregon.",
    "link": "https://static1.squarespace.com/static/5a28dc928a02c7e25a162897/t/61086b2f5b82022b96dcbfec/1627941689182/Resource+Guide+V5.pdf"
    }
  ],
  "disclaimer": "Please contact providers ahead of time, as hours and services may have changed due to COVID. This map is not updated in real time.",
  "contributors": [
      {
      "name": "Direction Service",
      "logo_url": "https://i.postimg.cc/zG6Wxkk7/DS-Logo-Web.jpg",
      "description": "Direction Service provides support for disabled children, youth, young adults, and their families in Eugene, Oregon. Direction Service worked closely with Healthy Transitions youth to make the map what it is today."
      },
      {
      "name": "Healthy Transitions Transition Age Youth (TAY)",
      "logo_url": "https://i.postimg.cc/bNhrmBb3/healthy-transitions-logo-2020.png",
      "description": "The idea for the Oregon Youth Resource Map was created by youth, for youth. The Map was first proposed in Youth and Young Adult Voices Comittees, which meet across the state of Oregon. The Healthy Transitions TAY team continues to guide and direct development of the Map."
      },
      {
      "name": "Mapping Action Collective",
      "logo_url": "https://i.postimg.cc/9M28z2Kv/mac-logo.png",
      "website_url": "https://mappingaction.org/",
      "description": "The Mapping Action Collective (MAC) uses mapping, data, and technology to support their community and beyond. MAC wrote the code and organized the database that powers the Oregon Youth Resource Map."
      },
      {
      "name": "Substance Abuse and Mental Health Services Administration (SAMHSA)",
      "description": "The Healthy Transitions SAMHSA Grant funds projects that increase access to mental health support for youth ages 16-25 in Oregon. The Oregon Youth Resource Map is initially funded by SAMHSA in partnership with PSU, OHA, and and Direction Service."
      },
      {
      "name": "Portland State University School of Social Work"
      },
      {
      "name": "Oregon Health Authority"
      },
      {
      "name": "White Bird Community Services",
      "logo_url": "https://i.postimg.cc/ydfGsq9Z/white-Bird-Logo.png",
      "description": "White Bird maintains the Little Help Book, a mental health resource guide which they generously shared with the Oregon Youth Resource Map."
      },
      {
      "name": "Street Roots",
      "description": "Street Roots works with and for the houseless community in Portland, Oregon. We thank them for sharing data from their resource guide for houseless Portanders, the Rose City Resource Guide."
      }
  ]
  }

const defaultMetadata = {
  "listingCategoryIcons": {
  "Basic Needs": {
  "icon": "utensils"
  },
  "Care & Safety": {
  "icon": "heart"
  },
  "Community Specific": {
  "icon": "users"
  },
  "Community Resources": {
  "icon": "users"
  },
  "Day Services & Drop-in": {
  "icon": "sun"
  },
  "Education": {
  "icon": "graduation cap"
  },
  "Financial": {
  "icon": "money bill alternate outline"
  },
  "Food": {
  "icon": "utensils"
  },
  "Health & Wellness": {
  "icon": "stethoscope"
  },
  "Housing & Shelter": {
  "icon": "home"
  },
  "Leadership Opportunities": {
  "icon": "flag"
  },
  "Legal": {
  "icon": "balance scale"
  },
  "More": {
  "icon": "info circle"
  },
  "Mental Health": {
  "icon": "heartbeat"
  },
  "Money": {
  "icon": "money bill alternate outline"
  },
  "Other": {
  "icon": "info circle"
  },
  "Social Services": {
  "icon": "heart"
  },
  "Specialized Assistance": {
  "icon": "handshake"
  },
  "Transit": {
  "icon": "bus"
  },
  "Work": {
  "icon": "briefcase"
  },
  "Work & Employment": {
  "icon": "briefcase"
  },
  "Youth Leadership": {
  "icon": "flag"
  }
  },
  "listingCategories": {
  "Day Services & Drop-in": {
  "Youth Drop-in": 3,
  "Libraries": 9,
  "Mail, Laundry, & Showers": 3,
  "Mental Health Drop-In": 1,
  "Drop-In": 2
  },
  "Legal": {
  "Legal Services": 7,
  "Domestic Violence and Sexual Assault": 6,
  "Advocacy & Know Your Rights": 4,
  "Housing & Renter's Rights": 2,
  "Rehabilitation": 1,
  "Immigration": 8
  },
  "Education": {
  "Alternative & Specialized Education": 7,
  "Education Access": 5,
  "After School Programs": 1,
  "High School & College": 2
  },
  "Work": {
  "Job Search Help": 14,
  "Job Training": 10,
  "Worker's Rights": 1
  },
  "Mental Health": {
  "Counseling": 48,
  "Residential Programs": 7,
  "Support Groups": 17,
  "Crisis Hotlines & Services": 48,
  "Addiction Recovery": 24,
  "BIPOC Mental Health": 3,
  "Resources & Advocacy": 1
  },
  "Housing & Shelter": {
  "Shelters & Emergency Shelters": 9,
  "Transitional Housing": 13,
  "Housing Services": 20,
  "Homeless Youth": 12,
  "Homeless Services": 7,
  "Emergency Cold Weather Shelters": 2
  },
  "Care & Safety": {
  "Pregnancy & Parenting": 11,
  "Social Services": 6,
  "Information & Referrals": 8,
  "Pet Care": 2,
  "Child Care": 2,
  "Domestic Violence & Sexual Assault": 16,
  "Foster Care & Youth Services": 3
  },
  "Youth Leadership": {
  "Committees, Councils, & Boards": 3,
  "Internship": 1,
  "Volunteer Opportunity": 1
  },
  "Community Resources": {
  "Cultural Centers": 19,
  "LGBTQ+ Resources": 42,
  "Disability Resources": 10,
  "Veteran Services": 10,
  "Advocacy & Mutual Aid": 4,
  "BIPOC Resources": 2
  },
  "Health & Wellness": {
  "Hospitals & Clinics": 45,
  "HIV / AIDS": 5,
  "Syringe Exchange": 24,
  "Reproductive Health": 5,
  "Dental": 2,
  "Healthcare Access": 2,
  "Student Health Centers": 51,
  "Holistic & Alternative Medicine": 1
  },
  "Basic Needs": {
  "Food Pantries & Boxes": 40,
  "Medical Transportation": 7,
  "Public Transit": 2,
  "Transportation": 5,
  "Clothing & Goods": 5,
  "Hot Meals": 13,
  "Fresh Produce": 1,
  "Food": 3
  },
  "Money": {
  "Rent & Utility Assistance": 24,
  "Phone & Internet": 3,
  "Financial Assistance": 5,
  "Public Benefit Application & OHP Assistance": 20
  }
  },
  "listingCities": {
  "Portland": 89,
  "Eugene": 192,
  "Salem": 4,
  "Gresham": 1,
  "Hillsboro": 2,
  "Bend": 19,
  "Beaverton": 3,
  "Medford": 14,
  "Springfield": 39,
  "Corvallis": 2,
  "Tigard": 2,
  "Grants Pass": 6,
  "Oregon City": 1,
  "McMinnville": 1,
  "Redmond": 7,
  "Happy Valley": 2,
  "Roseburg": 9,
  "Ashland": 1,
  "Milwaukie": 4,
  "Central Point": 6,
  "Sandy": 3,
  "Prineville": 5,
  "Cottage Grove": 11,
  "North Bend": 2,
  "Astoria": 2,
  "Eagle Point": 2,
  "Florence": 9,
  "Hood River": 2,
  "Scappoose": 1,
  "Madras": 6,
  "Junction City": 6,
  "Brookings": 2,
  "Talent": 2,
  "Creswell": 3,
  "Winston": 1,
  "Veneta": 4,
  "Reedsport": 1,
  "Jefferson": 1,
  "Oakridge": 3,
  "Burns": 2,
  "La Pine": 2
  }
}

const getListings = async API_URL => (await fetch(`${API_URL}/listings`)).json()
const getListingMetadata = async API_URL => (await fetch(`${API_URL}/listing-meta`)).json()
const getStaticText = async API_URL => {
  let staticText = await fetch(`${API_URL}/content`)
  // if this comes back empty, use the default text instead
  staticText = await staticText.json()
  return Object.keys(staticText).length === 0  ? defaultStaticText : staticText
}

export { getListings, getListingMetadata, getStaticText }
