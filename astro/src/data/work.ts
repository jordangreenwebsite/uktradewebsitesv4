import {portfolio} from './site';

/**
 * Curated combined portfolio.
 * First 17 records verified against Prunus Media's src/content/work/*.md,
 * 2026-11-09. Extra records retain the existing UK Trade Websites portfolio.
 * Do not imply that a concept, archived project or owned product is a live client.
 */
export type WorkStatus='live'|'archived'|'concept'|'owned'|'portfolio';
export interface WorkProject {
  id:string;
  title:string;
  description:string;
  category:string;
  status:WorkStatus;
  website?:string;
  image?:string;
  projectDetails?:string;
}
const originalImage=(business:string)=>portfolio.find(item=>item.business===business)?.image||'';
const agencyDetails=(slug:string)=>'https://prunusmedia.com/our-work/'+slug+'/';

export const workProjects:WorkProject[]=[
 {id:'j-piper-cleaning-services',title:'J Piper Cleaning Services',category:'Cleaning & commercial services',status:'live',description:'A service-led cleaning website with area pages, local SEO and an enquiry-first layout.',website:'https://jpipercleaning.com/',image:originalImage('J Piper Cleaning'),projectDetails:agencyDetails('j-piper-cleaning-services')},
 {id:'residential-roofing-and-fascias',title:'Residential Roofing & Fascias',category:'Roofing & home improvement',status:'live',description:'A 17-page roofing website rebuild with dedicated service and area pages and ongoing local SEO.',website:'https://residential-roofing-fascias.pages.dev/',projectDetails:'/our-work/residential-roofing-and-fascias/'},
 {id:'cotswold-pawprints',title:'Cotswold Pawprints',category:'Pet care',status:'live',description:'An approachable local pet-care website that presents services clearly and encourages enquiries.',website:'https://www.pawprintscotswolds.com/',image:originalImage('PawPrints Cotswolds'),projectDetails:agencyDetails('cotswold-pawprints')},
 {id:'katies-flower-hut',title:"Katie’s Flower Hut",category:'Florist website',status:'concept',description:'A gentle florist website concept showing bouquets, weddings, sympathy flowers and classes.',website:'https://katies-flower-hut.pages.dev/',projectDetails:agencyDetails('katies-flower-hut')},
 {id:'prunus-certificates',title:'Prunus Certificates',category:'Software & SaaS',status:'owned',description:'Our training-provider software for bookings, attendance, certificates, records and business administration.',website:'https://certificates.prunusmedia.com/',projectDetails:agencyDetails('prunus-certificates')},
 {id:'window-cleaning-calculator',title:'Window Cleaning Calculator',category:'Interactive web tool',status:'owned',description:'A free calculator built to make everyday window-cleaning pricing easier to work through.',website:'https://windowcleaningcalculator.co.uk/',projectDetails:agencyDetails('window-cleaning-calculator')},
 {id:'uk-trade-websites',title:'UK Trade Websites',category:'Trade website brand',status:'owned',description:'Our own trade-focused website service, built around accessible packages and SEO-ready sector pages.',website:'https://uktradewebsites.co.uk/',projectDetails:agencyDetails('uk-trade-websites')},
 {id:'caring-companions-pet-care',title:'Caring Companions Pet Care',category:'Pet care',status:'live',description:'A welcoming new pet-care website with clear services and straightforward ways to enquire.',website:'https://caringcompanionspetcare.co.uk/',image:'https://prunusmedia.com/wp-content/uploads/2026/09/Screenshot-2026-09-23-080741.png',projectDetails:agencyDetails('caring-companions-pet-care')},
 {id:'pp-power-detailing',title:'PP Power Detailing',category:'Car detailing',status:'live',description:'A website rebuild with clearer detailing service pages and a stronger local SEO structure.',website:'https://pppowerdetailing.com/',projectDetails:agencyDetails('pp-power-detailing')},
 {id:'tj-bespoke-designs',title:'TJ Bespoke Designs',category:'Craft & bespoke design',status:'concept',description:'A design concept exploring how bespoke work and business identity could be presented online.',website:'https://tjbespokedesignswebsite.pages.dev/',projectDetails:agencyDetails('tj-bespoke-designs')},
 {id:'lee-green',title:'Lee Green Painting & Decorating',category:'Painting & decorating',status:'concept',description:'A proposed website design for displaying decorating projects, services and local contact options.',website:'https://leegreen.pages.dev/',projectDetails:agencyDetails('lee-green')},
 {id:'clearview-bristol',title:'Clearview Bristol',category:'Local service business',status:'concept',description:'A clean service-business website preview focused on clear information and quote requests.',website:'https://clearviewbristol.pages.dev/',image:originalImage('Window cleaning concept'),projectDetails:agencyDetails('clearview-bristol')},
 {id:'charley-hayes-smr',title:'Charley Hayes SMR',category:'Wellness & treatments',status:'archived',description:'A completed treatment website, retained as finished design work despite no longer being used commercially.',website:'https://charleyhayessmr.pages.dev/',image:originalImage('Charley Hayes SMR Massage'),projectDetails:agencyDetails('charley-hayes-smr')},
 {id:'gudgeons-groundworks',title:'Gudgeons Groundworks',category:'Groundworks & construction',status:'concept',description:'A groundworks concept website showing how a contractor could present its services and previous work.',website:'https://gudgeonsgroundworks.pages.dev/',projectDetails:agencyDetails('gudgeons-groundworks')},
 {id:'car-care-tlc',title:'Car Care TLC',category:'Car care',status:'archived',description:'A complete car-care business website kept as an archived example of previous work.',website:'https://carcaretlc.co.uk/',image:originalImage('Car Care TLC'),projectDetails:agencyDetails('car-care-tlc')},
 {id:'michal-rebekah-art',title:'Michal Rebekah Art',category:'Art & creative',status:'live',description:'An art-first website that places the artist’s work and visual identity at the centre.',website:'https://www.michalrebekahart.com/',image:originalImage('Michal Rebekah Art'),projectDetails:agencyDetails('michal-rebekah-art')},
 {id:'coffee-at-odd-socks',title:'Coffee at Odd Socks',category:'Coffee & hospitality',status:'concept',description:'A characterful café website concept exploring an independent hospitality brand.',website:'https://coffeeatoddsocks.pages.dev/',image:originalImage('Coffee shop concept'),projectDetails:agencyDetails('coffee-at-odd-socks')},

 // Existing UK Trade Websites examples not yet listed in Prunus Media's work collection.
 {id:'my-sweet-pea-flowers',title:'My Sweet Pea Flowers',category:'Floral website',status:'portfolio',description:'A multi-page florist website with gentle styling and a shop-like browsing experience.',website:'https://www.mysweetpeaflowers.com/',image:originalImage('My Sweet Pea Flowers')},
 {id:'hush-bake',title:'Hush Bake',category:'Bakery website',status:'portfolio',description:'An uncluttered product-led website design with straightforward customer contact.',website:'https://hushbake.pages.dev/',image:originalImage('Hush Bake')},
 {id:'plumber-website-example',title:'Plumbing Website Design',category:'Plumbing',status:'concept',description:'A sample website layout with plumbing services, callout details and quote requests.',website:'https://exampleplumberwebsite.pages.dev/',image:originalImage('Plumbing concept')},
 {id:'electrician-website-example',title:'Electrician Website Design',category:'Electrical',status:'concept',description:'A sample layout built around trust, qualifications, services and easy local contact.',website:'https://exampleelectricianwebsite.pages.dev/',image:originalImage('Electrical concept')},
 {id:'construction-website-concept',title:'Construction Website Concept',category:'Construction',status:'concept',description:'A sample construction portfolio and quote-request layout.',image:originalImage('Construction concept')}
];
export const workStatusLabels:Record<WorkStatus,string>={
 live:'Live website',archived:'Archived project',concept:'Design concept',
 owned:'In-house project',portfolio:'Portfolio website'
};
