/** Page-specific search intent and copy. Phrases are editorial targets, not search-volume claims. */
export interface TradeSEO {
  title:string;
  description:string;
  focusPhrase:string;
  heading:string;
  copy:string;
}
export const tradeSeo:Record<string,TradeSEO>={
  'websites-for-plumbers':{
    title:'Plumber Website Design UK | Plumbing Websites',
    description:'Website design for plumbers across the UK. Clear plumbing service pages, mobile-friendly layouts and easy quote forms to help customers get in touch.',
    focusPhrase:'website design for plumbers',
    heading:'Website design for plumbers who want more enquiries',
    copy:'From emergency repairs to bathroom installations, a plumbing website should make the work you offer immediately clear. We organise your plumbing services, coverage areas and contact options so potential customers can find the right information and ask for a quote.'
  },
  'websites-for-electricians':{
    title:'Electrician Website Design | Electrical Websites UK',
    description:'Professional website design for electricians in the UK. Showcase EICRs, rewires, EV chargers and qualifications with fast pages and clear enquiry options.',
    focusPhrase:'website design for electricians',
    heading:'Electrical contractor websites built around trust',
    copy:'An electrician website can separate domestic callouts, landlord EICRs, rewiring and EV charging into clear sections. Add genuine qualifications, work photographs and areas covered so customers know whether your electrical business is right for their job.'
  },
  'websites-for-window-cleaners':{
    title:'Window Cleaning Website Design | UK Trade Websites',
    description:'Websites for window cleaners that show your rounds, service areas and exterior cleaning options. Simple mobile-friendly quote forms for local customers.',
    focusPhrase:'window cleaning website design',
    heading:'Window cleaning website design for growing your round',
    copy:'A window cleaning website should explain where your regular rounds run, whether you cover commercial properties, and what extra exterior cleaning services you provide. Make it straightforward for a homeowner to request a quote and for existing customers to contact you.'
  },
  'websites-for-painters':{
    title:'Painter & Decorator Website Design | UK Trades',
    description:'Website design for painters and decorators in the UK. Showcase interior and exterior projects, decorating services, real photos and quote enquiries.',
    focusPhrase:'painter and decorator website design',
    heading:'Painter and decorator websites that showcase your finish',
    copy:'Decorating customers often want to compare completed rooms, exterior work and wallpapering before requesting an estimate. We make real project galleries, your decorating specialisms and the areas you cover prominent across the site.'
  },
  'websites-for-floor-cleaners':{
    title:'Floor Cleaning Website Design | UK Trade Websites',
    description:'Websites for floor cleaning businesses in the UK. Explain hard floor, tile and grout, stone restoration and commercial cleaning services clearly.',
    focusPhrase:'floor cleaning website design',
    heading:'Specialist floor cleaning websites for domestic and commercial work',
    copy:'Different surfaces need different cleaning methods. A dedicated floor cleaning website can explain tile and grout cleaning, stone restoration, sealing and ongoing commercial maintenance, helping visitors understand your specialist services and request a site visit.'
  },
  'websites-for-roofers':{
    title:'Roofer Website Design UK | Roofing Company Websites',
    description:'Website design for UK roofers, from roof repairs to flat roofing and fascias. Show real projects, services and areas covered with clear quote forms.',
    focusPhrase:'website design for roofers',
    heading:'Roofing company websites that explain your services',
    copy:'A roofing website needs to help customers distinguish urgent leak repairs from full roof replacements, flat roof work and guttering. Clear service sections, authentic photos, qualifications and location information can build confidence before a customer requests a quote.'
  },
  'websites-for-builders':{
    title:'Builder Website Design UK | Construction Websites',
    description:'Websites for builders and construction businesses across the UK. Present extensions, renovations and project photos with simple quote enquiries.',
    focusPhrase:'website design for builders',
    heading:'Builder website design for extensions and renovations',
    copy:'Building projects need more explanation than a short service list. A builder website can highlight extensions, refurbishments and structural work separately, while genuine project photos and work descriptions help homeowners decide whether to enquire.'
  },
  'websites-for-landscapers':{
    title:'Landscaping Website Design | UK Garden Businesses',
    description:'Website design for landscapers in the UK. Showcase patios, garden design, fencing and decking projects with photos and easy quote requests.',
    focusPhrase:'landscaping website design',
    heading:'Landscaping websites that put your projects first',
    copy:'People planning a new garden want to see finished outdoor spaces. We give landscaping portfolios, patio installations, fencing, decking and garden design services room to stand out, with clear contact options for homeowners looking for estimates.'
  },
  'websites-for-plasterers':{
    title:'Plasterer Website Design UK | Plastering Websites',
    description:'Professional websites for UK plasterers. Show skimming, rendering, ceilings and dry lining work, service areas and straightforward quote forms.',
    focusPhrase:'plasterer website design',
    heading:'Plastering websites that show the quality of your finish',
    copy:'Customers need to know whether you handle skimming, plasterboarding, rendering and repair work. Show your best genuine finish photographs alongside the plastering services you provide and the areas where you accept new jobs.'
  },
  'websites-for-driveway-cleaners':{
    title:'Driveway Cleaning Website Design | UK Trades',
    description:'Websites for driveway and patio cleaning businesses in the UK. Show before-and-after cleaning, paving, re-sanding and sealing with clear quote options.',
    focusPhrase:'driveway cleaning website design',
    heading:'Driveway cleaning websites built for before-and-after results',
    copy:'Driveway and patio cleaning customers want to see the difference your work makes. A dedicated website can organise pressure washing, block paving re-sanding, patio cleaning and sealing, with genuine before-and-after images and easy photo-based quote requests.'
  }
};
