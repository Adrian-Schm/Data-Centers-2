// Auto-generated from DATABASE-DataCenter_Backlash.xlsx
// Run extract-projects.py to regenerate.
// Do not edit by hand.

const PROJECTS_META = {
  "generatedAt": "2026-06-08T15:58:20Z",
  "sourceFile": "DATABASE-DataCenter_Backlash.xlsx",
  "sheetsRead": [
    {
      "mainSheet": "Philadelphia Fed Region",
      "timelinesSheet": "PF Timelines",
      "projectCount": 12,
      "fullCount": 12
    },
    {
      "mainSheet": "NC VA",
      "timelinesSheet": "NC VA Timelines",
      "projectCount": 13,
      "fullCount": 9
    }
  ],
  "droppedNoCoords": 6
};

const PROJECTS = [
  {
    "id": "cumulus-hyperscale-data-center-campus",
    "name": "Cumulus Hyperscale Data Center Campus",
    "company": "Talen (developer) and Amazon Web Services (purchased 2024)",
    "investmentB": 0.65,
    "state": "PA",
    "county": "Luzerne",
    "communities": "Wilkes-Barre",
    "capacityMw": 960,
    "acreage": 1200,
    "timelineStart": "2021-07-01",
    "timelineEnd": "2023-01-01",
    "status": "Completed",
    "resourceClaims": "Developer and energy producer Talen built and leased the data center, claiming zero-carbon output because of agreements with Talen's nuclear power plants.",
    "energySources": "Talen Energy Corp. provides energy from its zero-carbon nuclear facility adjacent to the data center via interconnection service agreement.",
    "developerPromises": "Promises were directed at shareholders, focusing on new revenue sources for the power company.",
    "concernsCategories": "Individual Economic",
    "articulatedConcerns": "AEP and Exelon filed a complaint to FERC claiming that non-AWS customers would pay an additional $140 million due to increased energy capacity.",
    "communityPosture": "Neutral",
    "communityIntensity": "None",
    "communityActionDetails": "While local community action has been limited, utility companies filed complaints with FERC to block an expanded plant interconnection plan.",
    "developerAction": "Talen initially built the center to \"invest in opportunities created by the convergence of digital infrastructure and power,\" capitalizing on its rural loaction and control of the local energy market to build a data center with less bureaucratic and community barriers than other facilities.",
    "monthRecorded": "2026-05-01",
    "lat": 41.0839630042558,
    "lng": -76.1435100426483,
    "sources": {
      "projectProposal": "https://www.datacenterdynamics.com/en/news/talen-energy-to-build-300mw-nuclear-powered-cryptomining-facility-and-data-center-in-us/",
      "govtRecords": [
        "https://ir.talenenergy.com/node/7206/pdf"
      ],
      "other": [
        "https://www.datacenterdynamics.com/en/news/talen-energy-finishes-construction-on-first-data-center-at-pennsylvania-nuclear-station/",
        "https://www.datacenterdynamics.com/en/news/aws-acquires-talens-nuclear-data-center-campus-in-pennsylvania/",
        "https://www.datacenterdynamics.com/en/news/ferc-blocks-plan-for-susquehanna-nuclear-plant-interconnection-to-amazon-data-center/"
      ]
    },
    "stub": false,
    "coordsPrecision": null,
    "timeline": [
      {
        "date": "2021-07-12",
        "label": "Construction Begins",
        "isProposal": false,
        "source": "https://www.datacenterdynamics.com/en/news/talen-energy-to-build-300mw-nuclear-powered-cryptomining-facility-and-data-center-in-us/"
      },
      {
        "date": "2023-01-17",
        "label": "Construction Completed",
        "isProposal": false,
        "source": "https://www.datacenterdynamics.com/en/news/talen-energy-finishes-construction-on-first-data-center-at-pennsylvania-nuclear-station/"
      },
      {
        "date": "2024-03-04",
        "label": "Sale of Data Center to AWS Annouced",
        "isProposal": true,
        "source": "https://ir.talenenergy.com/node/7206/pdf"
      },
      {
        "date": "2024-03-04",
        "label": "Talen sells data center to Amazon Web Services for $650 million",
        "isProposal": false,
        "source": "https://www.spglobal.com/market-intelligence/en/news-insights/articles/2024/3/talen-energy-sells-pa-datacenter-campus-to-amazon-web-services-for-650m-80711401"
      },
      {
        "date": "2024-11-04",
        "label": "Federal Energy Regulatory Commission (FERC) blocks proposed interconnection service agreement (ISA) to increase load to data center",
        "isProposal": false,
        "source": "https://www.datacenterdynamics.com/en/news/ferc-blocks-plan-for-susquehanna-nuclear-plant-interconnection-to-amazon-data-center/"
      }
    ]
  },
  {
    "id": "dataone-vineland",
    "name": "DataOne Vineland",
    "company": "DataOne and the Nebius Group",
    "investmentB": 17.4,
    "state": "NJ",
    "county": "Cumberland",
    "communities": "Millville, Bridegerton, Deerfield",
    "capacityMw": 350,
    "acreage": 16,
    "timelineStart": "2025-03-01",
    "timelineEnd": "2026-11-01",
    "status": "Delayed/Scaled Back",
    "resourceClaims": "Developer claims energy usage impact on comunity will be limited.",
    "energySources": "85% on-site using existing natural gas pipeline; 15% from Vineland Municipal Utilities and Atlantic City Electric",
    "developerPromises": "Data center will not spike electricty bills",
    "concernsCategories": "Land, Water, QOL, Individual Economic, Environmental",
    "articulatedConcerns": "Residents are concerned about the lack of transparency in the project, specifically given that it wasn't public information until DataOne requested a loan from Vineland. Additionally, residents are worry how noise and rising electricity costs could impact quality of life.",
    "communityPosture": "Negative",
    "communityIntensity": "High",
    "communityActionDetails": "Environmental advocacy organizations have targeted the project after the public became aware of it. The New Jersey state legislature is working on regulation package limiting the size of data centers after backlash from the Vineland project.",
    "developerAction": "Project scaled back from 2.4 million sq feet to 718,000 square feet after Vineland denied $6 million loan",
    "monthRecorded": "2026-05-01",
    "lat": 39.4277541654666,
    "lng": -75.0166986453401,
    "sources": {
      "projectProposal": "https://whyy.org/articles/data-center-artificial-intelligence-vineland-new-jersey/",
      "govtRecords": [
        "https://northwiseproject.com/nbis-stock-vineland-nj-data-center/"
      ],
      "other": [
        "https://vinelandnj.portal.civicclerk.com/event/46/files/attachment/1926",
        "https://vinelandnj.portal.civicclerk.com/event/63/files/attachment/2007",
        "https://www.scottkompa.com/blog/vineland-ai-data-center-housing-market/"
      ]
    },
    "stub": false,
    "coordsPrecision": null,
    "timeline": [
      {
        "date": "2025-01-14",
        "label": "City council passes PILOT exemption for data center",
        "isProposal": false,
        "source": "https://vinelandnj.portal.civicclerk.com/event/46/files/attachment/1926"
      },
      {
        "date": "2025-03-01",
        "label": "Construction Begins",
        "isProposal": false,
        "source": "Project Proposal"
      },
      {
        "date": "2025-12-23",
        "label": "DataOne is denied $6 million loan due to community opposition",
        "isProposal": false,
        "source": "https://vinelandnj.portal.civicclerk.com/event/46/files/attachment/1926"
      },
      {
        "date": "2026-02-11",
        "label": null,
        "isProposal": true,
        "source": "https://northwiseproject.com/nbis-stock-vineland-nj-data-center/"
      },
      {
        "date": "2026-04-01",
        "label": "Project scaled back from 2.4 million sq feet to 718,000 square feet",
        "isProposal": false,
        "source": "https://www.scottkompa.com/blog/vineland-ai-data-center-housing-market/"
      }
    ]
  },
  {
    "id": "windstream-ephrata-data-center",
    "name": "Windstream Ephrata Data Center",
    "company": "Windstream Holdings, Inc.",
    "investmentB": "Not Available",
    "state": "PA",
    "county": "Lancaster",
    "communities": "Ephrata",
    "capacityMw": null,
    "acreage": null,
    "timelineStart": null,
    "timelineEnd": "Before 1992",
    "status": "Completed",
    "resourceClaims": null,
    "energySources": "Grid",
    "developerPromises": null,
    "concernsCategories": null,
    "articulatedConcerns": "No articulated community concerns related to the Windstream Ephrata data center.",
    "communityPosture": "Neutral",
    "communityIntensity": "None",
    "communityActionDetails": "Windstream acquired this data center along with D&E telecommunications in 2009.",
    "developerAction": null,
    "monthRecorded": "2026-06-01",
    "lat": 40.1699008501249,
    "lng": -76.1779137390098,
    "sources": {
      "projectProposal": "https://www.datacenterdynamics.com/en/news/windstream-announces-fourth-telecom-acquisition-this-year/",
      "govtRecords": [
        "https://cloudandcolocation.com/colocation-provider/windstream/"
      ],
      "other": []
    },
    "stub": false,
    "coordsPrecision": null,
    "timeline": [
      {
        "date": "2009",
        "label": "Windstream acquires Ephrata Data Center and D&E Communications for $330 million",
        "isProposal": false,
        "source": "https://www.datacenterdynamics.com/en/news/windstream-announces-fourth-telecom-acquisition-this-year/"
      }
    ]
  },
  {
    "id": "homer-city-energy-ai-campus",
    "name": "Homer City Energy + AI Campus",
    "company": "Homer City Redevelopment",
    "investmentB": 10,
    "state": "PA",
    "county": "Indiana",
    "communities": "Center Township",
    "capacityMw": 4500,
    "acreage": 3200,
    "timelineStart": "2026",
    "timelineEnd": "2027",
    "status": "In Progress",
    "resourceClaims": "Homer City Redevelopment is building its own natural gas turbines to avoid strain on the local grid.",
    "energySources": "Natural Gas",
    "developerPromises": "Creation of 10,000 construction-related jobs and 1,000 \"direct and indirect permanent high-paying positions\"",
    "concernsCategories": "Climate",
    "articulatedConcerns": "Community: 250 new wells will need to be drilled to support natural gas demand.",
    "communityPosture": "Negative",
    "communityIntensity": "Low",
    "communityActionDetails": "Community action group Concerned residents of Western Pennsylvania (CROW) established to protest data center, with specific challenges to the project's air pollution permit.",
    "developerAction": "N/A",
    "monthRecorded": "2026-06-01",
    "lat": 40.509833556025,
    "lng": -79.2045564741278,
    "sources": {
      "projectProposal": "https://www.homercityredevelopment.com/project-overview",
      "govtRecords": [],
      "other": []
    },
    "stub": false,
    "coordsPrecision": null,
    "timeline": [
      {
        "date": "2025",
        "label": "Pennsylvania Department of Environmental Protection approves redevelopment plans",
        "isProposal": false,
        "source": "https://www.pa.gov/agencies/dep/dep-regions/northwest-regional-office/homer-city-generation-redevelopment"
      },
      {
        "date": "2025-04-02",
        "label": "Project Announced",
        "isProposal": true,
        "source": "https://www.homercityredevelopment.com/project-overview"
      },
      {
        "date": "2026-04-01",
        "label": "Construction begins",
        "isProposal": false,
        "source": "https://www.bizjournals.com/pittsburgh/news/2026/04/01/homer-city-redevelopment-project-construction.html"
      }
    ]
  },
  {
    "id": "pax-pennsylvania-digital-i",
    "name": "PAX – Pennsylvania Digital I",
    "company": "Pennsylvania Data Center Partners",
    "investmentB": 15,
    "state": "PA",
    "county": "Cumberland",
    "communities": "Middlesex Township",
    "capacityMw": 1350,
    "acreage": 700,
    "timelineStart": "2025",
    "timelineEnd": "2027",
    "status": "In Progress",
    "resourceClaims": "Developer states that it will pay for grid updates to support increased demand at no cost to residents",
    "energySources": "Grid",
    "developerPromises": "1,400 jobs created; $65 million in direct tax revenue to community; slow to ramp up capacity: 2Q 2027 - 450 MW; 2Q 2028 - 900 MW; 2Q 2029 - 1,350 MW",
    "concernsCategories": "Climate, QOL",
    "articulatedConcerns": "Community: Center will be visible and audible from the Appalachian Trail",
    "communityPosture": "Negative",
    "communityIntensity": "Low",
    "communityActionDetails": "Statements issues by Appalachian Trail Conservancy and the Coalition to Protect Cumberland County PA from Data Centers",
    "developerAction": "Developer created a Q&A website to address community concerns.",
    "monthRecorded": "2026-06-01",
    "lat": 40.2560781344692,
    "lng": -77.118686893443,
    "sources": {
      "projectProposal": "https://pax1campus.com/",
      "govtRecords": [],
      "other": []
    },
    "stub": false,
    "coordsPrecision": null,
    "timeline": [
      {
        "date": "2025-01-22",
        "label": "Project approved by state of PA",
        "isProposal": false,
        "source": "https://www.pa.gov/agencies/oto/fasttrack/pennsylvaniadigital1"
      },
      {
        "date": "2025-10-25",
        "label": "Construction Begins",
        "isProposal": false,
        "source": "https://www.pa.gov/agencies/oto/fasttrack/pennsylvaniadigital1"
      },
      {
        "date": null,
        "label": null,
        "isProposal": true,
        "source": "https://pax1campus.com/"
      }
    ]
  },
  {
    "id": "coreweave-lancaster-ai-campuses",
    "name": "CoreWeave Lancaster AI Campuses",
    "company": "CoreWeave",
    "investmentB": 6,
    "state": "PA",
    "county": "Lancaster",
    "communities": "Lancaster",
    "capacityMw": 300,
    "acreage": "144 (across two campuses)",
    "timelineStart": "2025",
    "timelineEnd": "Summer 2027",
    "status": "In Progress",
    "resourceClaims": "Water consumption \"similar to a small office building\"",
    "energySources": "Grid",
    "developerPromises": "Project built in two former printing press facilities; 600 jobs during build phase, 175 permanent high-paying jobs",
    "concernsCategories": "QOL",
    "articulatedConcerns": "Individual: Concerns about potential impact articulated on social media prior to community benefits agreement",
    "communityPosture": "Neutral",
    "communityIntensity": "Low",
    "communityActionDetails": "N/A",
    "developerAction": "Community benefits agreement created with Town of Lancaster",
    "monthRecorded": "2026-06-01",
    "lat": 40.0595567106763,
    "lng": -76.3299567894937,
    "sources": {
      "projectProposal": "https://www.cityoflancasterpa.gov/data-center/",
      "govtRecords": [],
      "other": []
    },
    "stub": false,
    "coordsPrecision": null,
    "timeline": [
      {
        "date": "2025",
        "label": "Construction Begins",
        "isProposal": false,
        "source": "https://www.cityoflancasterpa.gov/data-center/"
      },
      {
        "date": "2025-02",
        "label": "Project Announced",
        "isProposal": true,
        "source": "https://www.cityoflancasterpa.gov/data-center/"
      }
    ]
  },
  {
    "id": "project-hazelnut",
    "name": "Project Hazelnut",
    "company": "NorthPoint",
    "investmentB": "Not Available",
    "state": "PA",
    "county": "Luzerne",
    "communities": "Hazle",
    "capacityMw": 1980,
    "acreage": 1306,
    "timelineStart": "2026",
    "timelineEnd": "2029",
    "status": "Planned",
    "resourceClaims": "Developer claims 2.8 million gallons water usage and limited impact of local energy supply.",
    "energySources": "Grid",
    "developerPromises": "$30 million community benefit package, job creation",
    "concernsCategories": "Water, Electricity, Individual economic, QOL",
    "articulatedConcerns": "Community: concern about massive scale of data center harming property values, local water treatment, noise, and pollution.",
    "communityPosture": "Negative",
    "communityIntensity": "High",
    "communityActionDetails": "The township voted 3-0 to deny the project's land development plans, leading to litigation that resulted in a Luzerne County judge ruling in favor of the township. In addition, the Pennsylvania Department of Environmental Protection held a hearing on the project in February 2026. Grassroots environmental organizations have also objected to the project.",
    "developerAction": "Developer has offered $30 million community benefits package to “help offset potential short-term localized utility rate increases.”",
    "monthRecorded": "2026-06-01",
    "lat": 40.9573187814357,
    "lng": -76.0348230780108,
    "sources": {
      "projectProposal": "https://www.luzernecounty.org/AgendaCenter/ViewFile/Agenda/_01212025-4075",
      "govtRecords": [],
      "other": []
    },
    "stub": false,
    "coordsPrecision": null,
    "timeline": [
      {
        "date": "2024-09-17",
        "label": "Project Announced",
        "isProposal": true,
        "source": "https://www.luzernecounty.org/AgendaCenter/ViewFile/Agenda/_01212025-4075"
      },
      {
        "date": "2024-09-17",
        "label": "Project Announced",
        "isProposal": false,
        "source": "https://www.luzernecounty.org/AgendaCenter/ViewFile/Agenda/_01212025-4075"
      },
      {
        "date": "2025-11",
        "label": "Hazle Township votes against NorthPoint's development plans",
        "isProposal": false,
        "source": "https://www.wvia.org/news/local/2026-02-18/residents-raise-questions-as-developer-describes-hazle-twp-data-center-plans-at-dep-hearing"
      },
      {
        "date": "2026-02-18",
        "label": "Pennsylvania Department of Environmental Protection holds hearing about project impact",
        "isProposal": false,
        "source": "https://www.wvia.org/news/local/2026-02-18/residents-raise-questions-as-developer-describes-hazle-twp-data-center-plans-at-dep-hearing"
      },
      {
        "date": "2026-05-28",
        "label": "Judge rules in favor of Hazle's rejection of NorthPoint's plans",
        "isProposal": false,
        "source": "https://www.standardspeaker.com/2026/05/28/judge-rules-against-project-hazelnut-data-center/"
      }
    ]
  },
  {
    "id": "klondike-data-center-project",
    "name": "Klondike Data Center Project",
    "company": "KDI Wyalusing Power LLC",
    "investmentB": "Not Available",
    "state": "PA",
    "county": "Bradford",
    "communities": "Wyalusing",
    "capacityMw": 248,
    "acreage": 14,
    "timelineStart": "Not available, must begin before April 2027 air permits expire",
    "timelineEnd": "Not available",
    "status": "Planned",
    "resourceClaims": "Developer claimed facility would generate its own power and include a demineralized water treatment system to control emissions.",
    "energySources": "Natural gas",
    "developerPromises": "Developer promised center would be a minor emitter of pollutants; Only source of admissions outside of turbines would be from a firewater pump.",
    "concernsCategories": "Climate",
    "articulatedConcerns": "Community: Concerns about environmental impact of air pollutants.",
    "communityPosture": "Negative",
    "communityIntensity": "Moderate",
    "communityActionDetails": "Community submitted 122 comments follow PA DEP hearing",
    "developerAction": "Developer issued a joint comment-response document with PA DEP.",
    "monthRecorded": "2026-06-01",
    "lat": 41.6542555106668,
    "lng": -76.2332393906146,
    "sources": {
      "projectProposal": "https://files.dep.state.pa.us/RegionalResources/NCRO/NCROPortalFiles/CommunityInformation/Wyalusing%20Energy%20Center%20PAA%2012-26-2024%20(Rev.%202-12-2025).pdf",
      "govtRecords": [],
      "other": []
    },
    "stub": false,
    "coordsPrecision": null,
    "timeline": [
      {
        "date": "2024-12",
        "label": "Klondike submits proposal to the Pennsylvania Department of Environmental Protection",
        "isProposal": true,
        "source": "https://files.dep.state.pa.us/RegionalResources/NCRO/NCROPortalFiles/CommunityInformation/Wyalusing_Energy_Center_PAApp_Redacted.pdf"
      },
      {
        "date": "2025-10-09",
        "label": "Developer issues joint comment-response document with PA DEP addressing environmental concerns",
        "isProposal": false,
        "source": "https://files.dep.state.pa.us/RegionalResources/NCRO/NCROPortalFiles/CommunityInformation/KDI%20Comment%20Response%20Document.pdf"
      },
      {
        "date": "2027-04",
        "label": "Latest construction may commence per air quality permits",
        "isProposal": false,
        "source": "https://paenvironmentdaily.blogspot.com/2025/10/pa-oil-gas-industrial-facilities-permit_24.html"
      }
    ]
  },
  {
    "id": "east-greenwich-township-data-center",
    "name": "East Greenwich Township Data Center",
    "company": "American Tower Corporation",
    "investmentB": "Not Available",
    "state": "NJ",
    "county": "Gloucester",
    "communities": "East Greenwich",
    "capacityMw": 4,
    "acreage": 6,
    "timelineStart": "Not available",
    "timelineEnd": "Not available",
    "status": "Planned",
    "resourceClaims": "The developer claims that the impact on the surrounding community will be limited due to the small size and unmanned nature of the data center.",
    "energySources": "Grid",
    "developerPromises": "None found",
    "concernsCategories": "QOL",
    "articulatedConcerns": "Community: The center's residential location has created concerns about declining home values.",
    "communityPosture": "Negative",
    "communityIntensity": "High",
    "communityActionDetails": "East Greenwich Township passed a ban on data centers. Permits to rezone the residential lot for data center usage are pending and will be addressed during a special meeting on June 30, 2026.",
    "developerAction": "The developer has described the project as a unmanned cell tower IT building.\"",
    "monthRecorded": "2026-06-01",
    "lat": 39.8010866724944,
    "lng": -75.1993622580656,
    "sources": {
      "projectProposal": "https://protectegnj.web.app/files/ATC-Major_Site_Plan-10Feb2026.pdf",
      "govtRecords": [],
      "other": []
    },
    "stub": false,
    "coordsPrecision": null,
    "timeline": [
      {
        "date": "2025-06-03",
        "label": "American Tower Corporation meets with East Greenwich Township to review project",
        "isProposal": false,
        "source": "https://woodburywarbler.com/what-the-documents-show-following-the-paper-trail-on-the-american-tower-data-center/"
      },
      {
        "date": "2026-02-10",
        "label": "Project Proposal",
        "isProposal": true,
        "source": "https://protectegnj.web.app/files/ATC-Major_Site_Plan-10Feb2026.pdf"
      },
      {
        "date": "2026-02-10",
        "label": "American Tower Corporation files site plan",
        "isProposal": false,
        "source": "https://protectegnj.web.app/files/ATC-Major_Site_Plan-10Feb2026.pdf"
      },
      {
        "date": "2026-05-26",
        "label": "East Greenwich Township Committee approves ban on data centers",
        "isProposal": false,
        "source": "https://whyy.org/articles/cherry-hill-data-center-new-jersey-fleisher-sherrill/"
      }
    ]
  },
  {
    "id": "st-georges-business-park-data-center-development-frightland-project",
    "name": "St. Georges Business Park Data Center Development / \"Frightland Project\"",
    "company": "Greggaro & Ferrera",
    "investmentB": "Not available",
    "state": "DE",
    "county": "New Castle",
    "communities": "St. Georges",
    "capacityMw": "600 to 1000",
    "acreage": 1500,
    "timelineStart": "Not available",
    "timelineEnd": "Not available",
    "status": "Proposed",
    "resourceClaims": "No developer statements on resource use.",
    "energySources": "Grid",
    "developerPromises": "Developer promises to build 366 homes alongside industrial development",
    "concernsCategories": "QOL",
    "articulatedConcerns": "Community: Concerns about building homes next to a data center",
    "communityPosture": "Negative",
    "communityIntensity": "Low",
    "communityActionDetails": "New Castle County Council is considering regulations including buffer zones.",
    "developerAction": "No developer action found",
    "monthRecorded": "2026-06-01",
    "lat": 39.527994229682,
    "lng": -75.6474439876628,
    "sources": {
      "projectProposal": "https://www3.newcastlede.gov/PDFDocument/default.aspx?DocumentID=80:FC40FF5826FBF7107D10260598B6C0724428DD1196872F86C5E68CE881F951C2D2BD769594D78C69354C344D0EE0A185&x=temp.pdf",
      "govtRecords": [],
      "other": []
    },
    "stub": false,
    "coordsPrecision": null,
    "timeline": [
      {
        "date": "2024-04-10",
        "label": "Developer submits exploratory plan to New Castle County",
        "isProposal": true,
        "source": "https://www3.newcastlede.gov/project/details/default.aspx?ProjectKey=793134"
      },
      {
        "date": "2025-12-02",
        "label": "Developer posts permitting signs on property",
        "isProposal": false,
        "source": "https://www3.newcastlede.gov/PDFDocument/default.aspx?DocumentID=80:FC40FF5826FBF7107D10260598B6C0724428DD1196872F86C5E68CE881F951C21D41AA30574486CF07826A32D4B743AA&x=temp.pdf"
      }
    ]
  },
  {
    "id": "white-clay-creek-business-park-data-center-redevelopment",
    "name": "White Clay Creek Business Park Data Center Redevelopment",
    "company": "Verdantas",
    "investmentB": "Not available",
    "state": "DE",
    "county": "New Castle",
    "communities": "Newark",
    "capacityMw": "Not available",
    "acreage": 44,
    "timelineStart": "Not available",
    "timelineEnd": "Not available",
    "status": "Proposed",
    "resourceClaims": "No developer statements on resource use.",
    "energySources": "Grid",
    "developerPromises": "Tax revenue",
    "concernsCategories": "Land, Water, Electricity, Climate",
    "articulatedConcerns": "Community: Concerns about noise, traffic, and environmental impact. Constituents also voiced concern about cumulative impacts of multiple data centers being constructed in New Castle county.",
    "communityPosture": "Negative",
    "communityIntensity": "Moderate",
    "communityActionDetails": "Public comments against the project have been submitted to New Castle County and posted on social media. The New Castle County Council is in the process of deciding whether newly-passed data center regulations should be applied to the Verdantas project.",
    "developerAction": "The developer has addressed concerns by submitting the required parking, traffic, and environmental impact assessments to satisfy the conditions for previously withheld permits.",
    "monthRecorded": "2026-06-01",
    "lat": 39.6826257357234,
    "lng": -75.7232983691438,
    "sources": {
      "projectProposal": "https://assets.delawarebusinesstimes.com/wp-content/uploads/2025/12/White-Clay-Corporate-Center-Letter-November.pdf",
      "govtRecords": [],
      "other": []
    },
    "stub": false,
    "coordsPrecision": null,
    "timeline": [
      {
        "date": "2025-11-18",
        "label": "Verdantas proposes data center in New Castle",
        "isProposal": true,
        "source": "https://assets.delawarebusinesstimes.com/wp-content/uploads/2025/12/White-Clay-Corporate-Center-Letter-November.pdf"
      },
      {
        "date": "2025-12-02",
        "label": "Verdantas submits exploratory plan for White Clay Creek Redevelopment",
        "isProposal": false,
        "source": "https://www3.newcastlede.gov/PDFDocument/default.aspx?DocumentID=80:FC40FF5826FBF7107D10260598B6C0724428DD1196872F86C5E68CE881F951C2BD306193DE6BA01D86AE058FFE85550A&x=temp.pdf"
      },
      {
        "date": "2026-03-18",
        "label": "New Castle County passes ordinance to establish data center zoning",
        "isProposal": false,
        "source": "https://www.newcastlede.gov/m/newsflash/home/detail/2615"
      }
    ]
  },
  {
    "id": "storage-data-center-project",
    "name": "Storage Data Center Project",
    "company": "N/A (County ordinance in anticipation of future data centers)",
    "investmentB": "N/A",
    "state": "PA",
    "county": "Tioga",
    "communities": "N/A",
    "capacityMw": "N/A",
    "acreage": "N/A",
    "timelineStart": "N/A",
    "timelineEnd": "N/A",
    "status": null,
    "resourceClaims": "N/A",
    "energySources": "N/A",
    "developerPromises": "N/A",
    "concernsCategories": "Land, Water, Electricity, Climate",
    "articulatedConcerns": "Community: Concerns regarding the absence of county-wide zoning and the rapid pace of data center development in neighboring areas have led Tioga County to implement an ordinance aimed at protecting environmental resources.",
    "communityPosture": "Neutral",
    "communityIntensity": "Moderate",
    "communityActionDetails": "In response to potential data center growth, Tioga County has enacted an ordinance establishing zoning restrictions to limit development near residential areas and scenic landscapes.",
    "developerAction": "N/A",
    "monthRecorded": "2026-02-01",
    "lat": 41.7691415727586,
    "lng": -77.2443751321176,
    "sources": {
      "projectProposal": "https://www.tiogacountypa.us/getmedia/8f770a00-d107-488f-8a49-6a15b03a141a/Tioga-County-Data-Centers-Ordinance-Final-12-15-25.pdf",
      "govtRecords": [],
      "other": []
    },
    "stub": false,
    "coordsPrecision": null,
    "timeline": [
      {
        "date": "2026-02-10",
        "label": "Tioga County passes data center ordinance",
        "isProposal": true,
        "source": "https://www.tiogacountypa.us/getmedia/8f770a00-d107-488f-8a49-6a15b03a141a/Tioga-County-Data-Centers-Ordinance-Final-12-15-25.pdf"
      }
    ]
  },
  {
    "id": "kingsboro-data-center-campus",
    "name": "Kingsboro Data Center Campus",
    "company": "Energy Storage Solutions, LLC",
    "investmentB": 19.2,
    "state": "NC",
    "county": "Edgecombe",
    "communities": null,
    "capacityMw": 900,
    "acreage": 155,
    "timelineStart": "2028",
    "timelineEnd": null,
    "status": "Proposed",
    "resourceClaims": "Net zero; natgas lines; EMP Hardened",
    "energySources": "Natural gas",
    "developerPromises": "500 employees",
    "concernsCategories": null,
    "articulatedConcerns": null,
    "communityPosture": "Positive",
    "communityIntensity": null,
    "communityActionDetails": "County Board of Commissioners amended ordinances to allow construction; sale of public land",
    "developerAction": null,
    "monthRecorded": "2026-04-01",
    "lat": 35.9243546164901,
    "lng": -77.6583439892765,
    "sources": {
      "projectProposal": "https://www.newsobserver.com/news/business/article313027720.html",
      "govtRecords": [
        "https://energystoragesolutionsllc.com/#30122b4d-3b71-43ef-8905-2f727b8b2742"
      ],
      "other": []
    },
    "stub": false,
    "coordsPrecision": null,
    "timeline": []
  },
  {
    "id": "tarboro-data-center-campus",
    "name": "Tarboro Data Center Campus",
    "company": "Energy Storage Solutions, LLC",
    "investmentB": 6.4,
    "state": "NC",
    "county": "Edgecombe",
    "communities": "Tarboro",
    "capacityMw": 300,
    "acreage": 52,
    "timelineStart": "2028",
    "timelineEnd": null,
    "status": "Delayed/Scaled Back",
    "resourceClaims": "Net zero; natgas lines, substation and solar; build own substation; EMP hardened",
    "energySources": "Natural gas, Solar",
    "developerPromises": "500 Employees, 11m/yr in revenue",
    "concernsCategories": "Water, Climate, QOL",
    "articulatedConcerns": null,
    "communityPosture": "Negative",
    "communityIntensity": null,
    "communityActionDetails": "Town of Tarboro denied special permit",
    "developerAction": "Appeal to Superior County Court",
    "monthRecorded": "2026-04-01",
    "lat": 35.9052413354529,
    "lng": -77.5787098240266,
    "sources": {
      "projectProposal": "https://www.datacenterdynamics.com/en/news/developers-to-appeal-data-center-rejection-in-tarboro-north-carolina/",
      "govtRecords": [
        "https://energystoragesolutionsllc.com/#30122b4d-3b71-43ef-8905-2f727b8b2742"
      ],
      "other": [
        "https://www.connectcre.com/stories/energy-storage-solutions-seeking-permit-for-6-4b-data-center/",
        "https://www.newsobserver.com/news/business/article312048998.html",
        "https://cms5.revize.com/revize/tarboronc/Document%20Center/Agenda%20&%20Minutes/2025/Minutes/9-8-25m.pdf?t=202510141005300&t=202510141005300"
      ]
    },
    "stub": false,
    "coordsPrecision": null,
    "timeline": []
  },
  {
    "id": "microsoft-stover-north-data-center",
    "name": "Microsoft Stover North Data Center",
    "company": "Microsoft",
    "investmentB": "1B Joint",
    "state": "NC",
    "county": "Catawba",
    "communities": "Hickory",
    "capacityMw": 270,
    "acreage": 158,
    "timelineStart": "2028",
    "timelineEnd": null,
    "status": "Delayed/Scaled Back",
    "resourceClaims": "Duke Energy dedicated substation, deal for 4.5 GW",
    "energySources": null,
    "developerPromises": "Part of $1b investment in Catawba over 10 years",
    "concernsCategories": null,
    "articulatedConcerns": null,
    "communityPosture": "Positive",
    "communityIntensity": null,
    "communityActionDetails": null,
    "developerAction": null,
    "monthRecorded": "2026-04-01",
    "lat": 35.619096,
    "lng": -81.31578,
    "sources": {
      "projectProposal": "https://saw-reg.usace.army.mil/PN/2023/SAW-2022-02515-PN.pdf",
      "govtRecords": [],
      "other": []
    },
    "stub": false,
    "coordsPrecision": null,
    "timeline": []
  },
  {
    "id": "microsoft-lyle-creek-data-center",
    "name": "Microsoft Lyle Creek Data Center",
    "company": "Microsoft",
    "investmentB": "1B Joint",
    "state": "NC",
    "county": "Catawba",
    "communities": "Conover",
    "capacityMw": 270,
    "acreage": 220,
    "timelineStart": "2028",
    "timelineEnd": null,
    "status": "Delayed/Scaled Back",
    "resourceClaims": "Two nearby substations",
    "energySources": null,
    "developerPromises": "Part of $1b investment in Catawba over 10 years",
    "concernsCategories": null,
    "articulatedConcerns": null,
    "communityPosture": "Positive",
    "communityIntensity": null,
    "communityActionDetails": null,
    "developerAction": null,
    "monthRecorded": "2026-04-01",
    "lat": 35.731135,
    "lng": -81.205389,
    "sources": {
      "projectProposal": "https://saw-reg.usace.army.mil/PN/2023/SAW-2023-00898-PN.pdf",
      "govtRecords": [],
      "other": []
    },
    "stub": false,
    "coordsPrecision": null,
    "timeline": []
  },
  {
    "id": "microsoft-boyd-farm-data-center",
    "name": "Microsoft Boyd Farm Data Center",
    "company": "Microsoft",
    "investmentB": "1B Joint",
    "state": "NC",
    "county": "Catawba",
    "communities": "Maiden",
    "capacityMw": 270,
    "acreage": 292,
    "timelineStart": "2028",
    "timelineEnd": null,
    "status": "Delayed/Scaled Back",
    "resourceClaims": null,
    "energySources": null,
    "developerPromises": "Part of $1b investment in Catawba over 10 years",
    "concernsCategories": null,
    "articulatedConcerns": null,
    "communityPosture": "Positive",
    "communityIntensity": null,
    "communityActionDetails": null,
    "developerAction": null,
    "monthRecorded": "2026-04-01",
    "lat": 35.589794,
    "lng": -81.235323,
    "sources": {
      "projectProposal": "https://saw-reg.usace.army.mil/PN/2023/SAW-2023-00665-PN.pdf",
      "govtRecords": [],
      "other": []
    },
    "stub": false,
    "coordsPrecision": null,
    "timeline": []
  },
  {
    "id": "balico-data-center-megacampus",
    "name": "Balico Data Center Megacampus",
    "company": "Balico, LLC",
    "investmentB": 3.7,
    "state": "VA",
    "county": "Pittsylvania",
    "communities": "Chatham",
    "capacityMw": 3500,
    "acreage": 2200,
    "timelineStart": null,
    "timelineEnd": null,
    "status": "Cancelled - Withdrawn",
    "resourceClaims": "On-site gas powerplant included in construction",
    "energySources": null,
    "developerPromises": "390 jobs between dc and plant, +$50-184m in annual taxes",
    "concernsCategories": "QOL, Climate, Governmental Economic",
    "articulatedConcerns": null,
    "communityPosture": "Negative",
    "communityIntensity": null,
    "communityActionDetails": "County Board denied revision",
    "developerAction": "Revised then withdrew proposal, cancelled data center",
    "monthRecorded": "2026-04-01",
    "lat": 36.804,
    "lng": -79.39,
    "sources": {
      "projectProposal": "https://cardinalnews.org/2025/04/14/balico-withdraws-data-center-proposal-for-pittsylvania-after-months-of-resident-pushback-and-vote-postponements/",
      "govtRecords": [],
      "other": []
    },
    "stub": false,
    "coordsPrecision": null,
    "timeline": []
  },
  {
    "id": "cleanarc-campus",
    "name": "CleanArc Campus",
    "company": "CleanArc",
    "investmentB": 3,
    "state": "VA",
    "county": "Caroline",
    "communities": null,
    "capacityMw": 900,
    "acreage": null,
    "timelineStart": "2030+",
    "timelineEnd": null,
    "status": "Proposed",
    "resourceClaims": null,
    "energySources": null,
    "developerPromises": "50 jobs, revenue, quality of life; largest investment ever in the county",
    "concernsCategories": null,
    "articulatedConcerns": null,
    "communityPosture": "Positive",
    "communityIntensity": null,
    "communityActionDetails": "County Board claims it set exacting standards: buffering from communities, noise abatement provisions, screening requirements, and the prohibition of the use of potable water for industrial cooling",
    "developerAction": null,
    "monthRecorded": "2026-04-01",
    "lat": 37.989718,
    "lng": -77.491225,
    "sources": {
      "projectProposal": "https://www.vedp.org/press-release/2025-11/cleanarc-caroline",
      "govtRecords": [
        "https://www.cleanarcdatacenters.com/press-release/cleanarc-data-centers-adds-300mw-to-planned-capacity-for-virginia-hyperscale-campus-2/"
      ],
      "other": []
    },
    "stub": false,
    "coordsPrecision": null,
    "timeline": []
  }
];
