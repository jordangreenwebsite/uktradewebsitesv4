export const site = {
  name: 'UK Trade Websites',
  url: 'https://uktradewebsites.co.uk',
  description: 'We build fast, professional websites for UK trades that help generate more calls, quotes and jobs. Simple pricing, no bloat, built for trades.',
  logo: '/wp-content/uploads/2026/03/cropped-UK-TRADE-WEbsites-1.png',
  favicon: '/wp-content/uploads/2026/03/cropped-UK-TRADE-WEbsites-1-32x32.png',
  email: 'uktradewebsites@gmail.com',
  whatsapp: 'https://wa.me/447789545807?text=' + encodeURIComponent("Hi, I'd like a free quote for a trade website."),
  formAction: 'https://formspree.io/f/xpqjvloy',
} as const;
export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Example Websites', href: '/example-websites/' },
  { label: 'Our Process', href: '/our-process/' },
  { label: 'About Us', href: '/about-us/' },
  { label: 'Contact Us', href: '/contact-us/' },
] as const;
export const packages = [
  {
    name:'Starter Website', pageRange:'1–5 pages', upfront:149, monthly:39, featured:false,
    description:'A professional online home for your trade business.',
    items:['1–5 pages for your key business information','Mobile-friendly design using your logo and colours','Call-to-action buttons and an enquiry form','Initial page titles, descriptions and basic SEO setup','Standard hosting, SSL and basic technical upkeep']
  },
  {
    name:'Trade Growth Website', pageRange:'5–9 pages', upfront:249, monthly:39, featured:true,
    description:'More room to showcase your services and local work.',
    items:['5–9 pages with individual service sections','More tailored design and page structure','Dedicated service-page SEO titles and descriptions','Internal links, enquiry forms and contact buttons','Standard hosting, SSL and basic technical upkeep']
  }
] as const;
export const monthlyOnly = {
  name:'No Upfront Website',pageRange:'5–9 pages',monthly:65,hostingAfterYear:39,buildRepaymentMonths:12,
  description:'A template-led build that spreads the website cost over the first year.',
  items:['5–9 pages using an established trade layout','You supply your wording, logo and images','Mobile-friendly pages and an enquiry form','Initial SEO page titles and descriptions','Hosting and technical upkeep included']
} as const;
export const seoHosting = {
  monthlySeo:195,
  standardHosting:39,
  heading:'Sign up for ongoing SEO for £195 a month and get hosting for free.',
  financedNote:'Standard hosting is included while SEO is active. No-upfront builds still have a £26/month build payment for the first 12 months.'
} as const;
const media = '/wp-content/uploads/2026/';
export const portfolio = [
 {name:'Window Cleaning Website',business:'J Piper Cleaning',description:'An established exterior cleaning business, with clear services, mobile-friendly pages and local SEO.',image:media+'08/Screenshot-2026-08-20-052252-1024x486.png',url:'https://jpipercleaning.com/',type:'client'},
 {name:'Multi Page Floristry Website',business:'My Sweet Pea Flowers',description:'A beautiful multi-page website with a shop-style element and a strong focus on the brand.',image:media+'03/image2-768x521.jpeg',url:'https://www.mysweetpeaflowers.com/',type:'client'},
 {name:'Personable Dog Walking Website',business:'PawPrints Cotswolds',description:'A welcoming website to present dog walking services to local customers.',image:media+'03/image3-768x521.jpeg',url:'https://www.pawprintscotswolds.com/',type:'client'},
 {name:'Online Art Shop & Gallery Website',business:'Michal Rebekah Art',description:'Artwork-focused presentation with a gallery and opportunities to browse and buy.',image:media+'05/Screenshot-2026-05-27-043455-1024x530.png',url:'https://www.michalrebekahart.co.uk/',type:'client'},
 {name:'Local SEO Massage Therapy Website',business:'Charley Hayes SMR Massage',description:'A treatment-led design focused on local visibility and an easy route to booking.',image:media+'08/Screenshot-2026-08-20-052158-1024x489.png',url:'https://charleyhayessmr.pages.dev/',type:'client'},
 {name:'Balanced Multi Services Website',business:'Car Care TLC',description:'A clear service-led site bringing car care and driving lessons together.',image:media+'08/Screenshot-2026-08-20-052217-1024x489.png',url:'https://carcaretlc.co.uk/',type:'client'},
 {name:'Clean Stylish Website',business:'Hush Bake',description:'Clean design that makes products prominent and helps customers enquire.',image:media+'08/Screenshot-2026-08-20-053657-1024x491.png',url:'https://hushbake.pages.dev/',type:'client'},
 {name:'Plumber Website Example',business:'Plumbing concept',description:'Built around emergency callouts, services, areas covered and quote requests.',image:media+'05/Screenshot-2026-05-27-071704-1024x598.png',url:'https://exampleplumberwebsite.pages.dev/',type:'concept'},
 {name:'Electrician Website Example',business:'Electrical concept',description:'Designed around trust, accreditations, local services and fast contact.',image:media+'05/Screenshot-2026-05-27-075937-1024x597.png',url:'https://exampleelectricianwebsite.pages.dev/',type:'concept'},
 {name:'Construction Website Concept',business:'Construction concept',description:'A professional construction layout for projects, trust signals and quote requests.',image:media+'05/Screenshot-2026-05-27-090959-1024x498.png',type:'concept'},
 {name:'Coffee Shop Website Concept',business:'Coffee shop concept',description:'A warm presentation of the menu, location and customer contact details.',image:media+'05/Screenshot-2026-05-27-082939-1024x531.png',url:'https://coffeeatoddsocks.pages.dev/',type:'concept'},
 {name:'Window Cleaning Website Concept',business:'Window cleaning concept',description:'A straightforward local cleaning website focused on quote requests.',image:media+'05/Screenshot-2026-05-27-083119-1024x569.png',url:'https://clearviewbristol.pages.dev/',type:'concept'},
] as const;
