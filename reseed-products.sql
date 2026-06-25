-- ============================================================================
--  Re-seed the products table to match the new catalogue (src/data/products.ts)
-- ============================================================================
--  Run this ONCE in the Supabase SQL editor AFTER deploying the new images.
--  It upserts all 12 current products (inserting new ones, refreshing images /
--  fields on existing slugs) and deletes any product no longer in the catalogue.
--  Safe to re-run. Dollar-quoting ($$...$$) avoids any apostrophe escaping.
-- ============================================================================

insert into public.products
  (slug, name, category_slug, subcategory_slug, summary, description, images, materials, dimensions, collection, is_featured, is_new)
values
  -- ---------------------------------- SOFAS ----------------------------------
  ('cloud-sofa', $$Cloud 3-Seater Sofa$$, 'sofas', 'sofas',
   $$A deep, feather-soft three-seater you sink straight into.$$,
   $$The Cloud lives up to its name — overstuffed, feather-wrapped cushions over a generous frame, dressed in a soft cream weave. The loose back pillows and rounded arms make it as relaxed as it looks, while a hidden hardwood frame keeps it built to last.$$,
   $$[{"src":"/images/sofas/cloud-1.webp","alt":"Cloud three-seater sofa in cream fabric, front view","width":1600,"height":1600},{"src":"/images/sofas/cloud-2.webp","alt":"Cloud three-seater sofa, angled view","width":1600,"height":1600},{"src":"/images/sofas/cloud-3.webp","alt":"Cloud three-seater sofa, side detail","width":1600,"height":1600}]$$::jsonb,
   $$[{"name":"Soft cream performance weave"},{"name":"Feather-wrapped foam cushions"},{"name":"Kiln-dried hardwood frame"}]$$::jsonb,
   $${"width":240,"depth":105,"height":85,"seatHeight":45,"unit":"cm"}$$::jsonb,
   'Signature', true, false),

  ('oslo-sofa', $$Oslo 3-Seater Sofa$$, 'sofas', 'sofas',
   $$A tailored three-seater in textured oatmeal on a raised wood base.$$,
   $$Oslo balances comfort and structure — plump bench cushions and a clean back line raised on a pale solid-wood base. Its softly textured oatmeal weave brings warmth to a restrained, contemporary silhouette that suits almost any room.$$,
   $$[{"src":"/images/sofas/oslo-1.webp","alt":"Oslo three-seater sofa in oatmeal fabric, front view","width":1600,"height":1600},{"src":"/images/sofas/oslo-2.webp","alt":"Oslo three-seater sofa, angled view","width":1600,"height":1600},{"src":"/images/sofas/oslo-3.webp","alt":"Oslo three-seater sofa, side profile","width":1600,"height":1600}]$$::jsonb,
   $$[{"name":"Textured oatmeal weave"},{"name":"Solid wood base"},{"name":"High-resilience foam cushions"}]$$::jsonb,
   $${"width":230,"depth":98,"height":82,"seatHeight":46,"unit":"cm"}$$::jsonb,
   'Atelier', false, true),

  ('palermo-sofa', $$Palermo Bouclé Sofa$$, 'sofas', 'sofas',
   $$A low, extra-deep sofa layered in soft bouclé cushions.$$,
   $$Palermo is built for lounging — a low, extra-deep seat piled with soft bouclé scatter and bolster cushions, set on a discreet dark plinth so the upholstery appears to float. An effortless, contemporary centrepiece.$$,
   $$[{"src":"/images/sofas/palermo-1.webp","alt":"Palermo bouclé sofa in pale grey, front view","width":1600,"height":1600},{"src":"/images/sofas/palermo-2.webp","alt":"Palermo bouclé sofa, angled view","width":1600,"height":1600},{"src":"/images/sofas/palermo-3.webp","alt":"Palermo bouclé sofa, detail","width":1600,"height":1600}]$$::jsonb,
   $$[{"name":"Soft pale-grey bouclé"},{"name":"Feather-and-foam cushions"},{"name":"Recessed dark plinth"}]$$::jsonb,
   $${"width":250,"depth":115,"height":78,"seatHeight":42,"unit":"cm"}$$::jsonb,
   'Signature', false, true),

  ('skyline-sofa', $$Skyline Sofa$$, 'sofas', 'sofas',
   $$A crisp, tailored sofa in charcoal on a warm walnut base.$$,
   $$Skyline is all clean lines — slim track arms and tailored cushions in a charcoal weave, lifted on a warm walnut-stained base. Quietly modern, it anchors a room without weighing it down.$$,
   $$[{"src":"/images/sofas/skyline-1.webp","alt":"Skyline three-seater sofa in charcoal on a walnut base, front view","width":1600,"height":1600},{"src":"/images/sofas/skyline-2.webp","alt":"Skyline sofa, two-seater configuration","width":1600,"height":1600},{"src":"/images/sofas/skyline-3.webp","alt":"Skyline sofa, alternate view","width":1600,"height":1600}]$$::jsonb,
   $$[{"name":"Charcoal chenille weave"},{"name":"Walnut-stained solid wood base"},{"name":"High-resilience foam"}]$$::jsonb,
   $${"width":230,"depth":95,"height":78,"seatHeight":44,"unit":"cm"}$$::jsonb,
   'Atelier', false, true),

  -- ------------------------------- SECTIONALS --------------------------------
  ('rivera-u-sectional', $$Rivera U-Sectional$$, 'living-room', 'sectionals',
   $$A modular U-shaped sectional that seats the whole family.$$,
   $$Rivera is a true centrepiece — a large modular U-shape that can be arranged to fit your room, with plush seats and a soft beige weave. Built in sections, it adapts as your space changes.$$,
   $$[{"src":"/images/sectionals/rivera-1.webp","alt":"Rivera beige U-shaped modular sectional, top view","width":1200,"height":800},{"src":"/images/sectionals/rivera-2.jpg","alt":"Rivera U-sectional styled in a living room","width":1200,"height":800},{"src":"/images/sectionals/rivera-3.webp","alt":"Rivera U-sectional, detail","width":1200,"height":800}]$$::jsonb,
   $$[{"name":"Soft beige weave"},{"name":"Modular section construction"},{"name":"High-resilience foam"}]$$::jsonb,
   $${"width":360,"depth":280,"height":85,"seatHeight":45,"unit":"cm"}$$::jsonb,
   'Signature', false, false),

  ('cosmo-modular-sectional', $$Cosmo Modular Sectional$$, 'living-room', 'sectionals',
   $$A low, modular sectional with a chaise and slim chrome legs.$$,
   $$Cosmo brings a lighter, more contemporary line — low modular blocks raised on slim chrome feet, with a deep chaise to stretch out on. Its mixed-tone weave and clean base keep a large piece feeling airy.$$,
   $$[{"src":"/images/sectionals/cosmo-1.webp","alt":"Cosmo modular sectional with chaise and chrome legs, front view","width":1200,"height":800}]$$::jsonb,
   $$[{"name":"Mixed-tone upholstery weave"},{"name":"Polished chrome legs"},{"name":"Modular foam seating"}]$$::jsonb,
   $${"width":340,"depth":170,"height":70,"seatHeight":42,"unit":"cm"}$$::jsonb,
   'Atelier', false, false),

  ('marlow-sectional', $$Marlow Lounge Sectional$$, 'living-room', 'sectionals',
   $$A low, lounge-depth sectional with a relaxed slipcover.$$,
   $$Marlow is built for slow afternoons — a low seat, extra depth, and a soft tailored slipcover that lifts off completely for cleaning. Scatter cushions in the same cloth complete an easy, understated look.$$,
   $$[{"src":"/images/sectionals/marlow-1.webp","alt":"Marlow slipcover lounge sectional in cream, front view","width":1600,"height":1600},{"src":"/images/sectionals/marlow-2.webp","alt":"Marlow lounge sectional, wide view","width":1600,"height":1600},{"src":"/images/sectionals/marlow-3.webp","alt":"Marlow lounge sectional, detail","width":1600,"height":1600}]$$::jsonb,
   $$[{"name":"Removable washable slipcover"},{"name":"Down-blend cushions"}]$$::jsonb,
   $${"width":300,"depth":120,"height":78,"seatHeight":42,"unit":"cm"}$$::jsonb,
   'Atelier', false, false),

  ('cascade-sectional', $$Cascade Inclined Sectional$$, 'living-room', 'sectionals',
   $$A soft, angled modular sectional with deep lounging seats.$$,
   $$Cascade is pure comfort — generous, angled modules in a relaxed off-white linen, with overstuffed cushions and a low, grounded base. Its inclined layout gently wraps a seating area for easy, sink-in lounging.$$,
   $$[{"src":"/images/sectionals/cascade-1.webp","alt":"Cascade inclined modular sectional in off-white linen, angled view","width":1600,"height":1600},{"src":"/images/sectionals/cascade-2.webp","alt":"Cascade sectional, alternate angle","width":1600,"height":1600},{"src":"/images/sectionals/cascade-3.webp","alt":"Cascade sectional, detail","width":1600,"height":1600}]$$::jsonb,
   $$[{"name":"Relaxed off-white linen"},{"name":"Feather-blend cushions"},{"name":"Modular construction"}]$$::jsonb,
   $${"width":330,"depth":180,"height":72,"seatHeight":42,"unit":"cm"}$$::jsonb,
   'Signature', true, false),

  -- ---------------------------------- BEDS -----------------------------------
  ('comfort-bed', $$Comfort Upholstered Bed$$, 'bedroom', 'beds',
   $$A softly padded bed with split cushioned headboard panels.$$,
   $$Comfort wraps the room in calm — a fully upholstered frame topped with soft, split headboard cushions you can lean into. Available with a lift-up storage base, it pairs deep comfort with everyday practicality.$$,
   $$[{"src":"/images/beds/comfort-1.webp","alt":"Comfort upholstered bed in blue fabric with split cushioned headboard","width":1600,"height":1600},{"src":"/images/beds/comfort-2.webp","alt":"Comfort bed, king configuration","width":1600,"height":1600},{"src":"/images/beds/comfort-3.webp","alt":"Comfort bed, alternate view","width":1600,"height":1600},{"src":"/images/beds/storage-mechanism-1.webp","alt":"Lift-up slatted storage base, shown raised","width":1800,"height":950}]$$::jsonb,
   $$[{"name":"Soft upholstery weave"},{"name":"Padded split headboard"},{"name":"Optional lift-up storage base"}]$$::jsonb,
   $${"width":196,"depth":215,"height":110,"unit":"cm"}$$::jsonb,
   'Signature', false, true),

  ('haven-bed', $$Haven Upholstered Bed$$, 'bedroom', 'beds',
   $$A low, enveloping bed with a soft wrapped headboard.$$,
   $$Haven is quietly grounding — a low, fully upholstered frame in a warm taupe weave with a soft split headboard. Offered in several colourways and sizes, with an optional lift-up storage base.$$,
   $$[{"src":"/images/beds/haven-1.webp","alt":"Haven upholstered bed in taupe, king size, front view","width":1600,"height":1600},{"src":"/images/beds/haven-2.webp","alt":"Haven bed in off-white, queen size","width":1600,"height":1600},{"src":"/images/beds/haven-3.webp","alt":"Haven bed in blue, queen size","width":1600,"height":1600},{"src":"/images/beds/haven-4-dimensions.webp","alt":"Haven bed dimensions diagram","width":1800,"height":950},{"src":"/images/beds/storage-mechanism-1.webp","alt":"Lift-up slatted storage base, shown raised","width":1800,"height":950}]$$::jsonb,
   $$[{"name":"Warm taupe weave (multiple colourways)"},{"name":"Padded wrapped headboard"},{"name":"Optional lift-up storage base"}]$$::jsonb,
   $${"width":196,"depth":215,"height":100,"unit":"cm"}$$::jsonb,
   'Signature', true, false),

  ('lora-bed', $$Lora Curved Bed$$, 'bedroom', 'beds',
   $$A rounded, fully-upholstered bed with a soft sculptural headboard.$$,
   $$Lora is quietly sculptural — a continuous, rounded headboard and base wrapped in a soft weave. The gentle curves make the bed the centrepiece of the room, with an optional lift-up storage base hidden beneath.$$,
   $$[{"src":"/images/beds/lora-1.webp","alt":"Lora curved upholstered bed, front view","width":1600,"height":1600},{"src":"/images/beds/lora-2.webp","alt":"Lora curved bed, alternate colourway","width":1600,"height":1600},{"src":"/images/beds/storage-mechanism-1.webp","alt":"Lift-up slatted storage base, shown raised","width":1800,"height":950}]$$::jsonb,
   $$[{"name":"Soft upholstery weave"},{"name":"Rounded wrapped headboard"},{"name":"Optional lift-up storage base"}]$$::jsonb,
   $${"width":196,"depth":215,"height":105,"unit":"cm"}$$::jsonb,
   'Atelier', false, true),

  -- -------------------------------- TV UNITS ---------------------------------
  ('day-tv-unit', $$Day TV Unit$$, 'tv-units', 'tv-units',
   $$A long, low push-to-open media console in solid wood veneers.$$,
   $$Day is a clean, grain-forward media console — a long, low cabinet with handleless push-to-open fronts and generous storage for everything below the screen. Offered in three wood finishes to suit the room.$$,
   $$[{"src":"/images/tv-units/day-natural-oak.webp","alt":"Day TV unit in natural oak","width":1800,"height":700},{"src":"/images/tv-units/day-medium-walnut.webp","alt":"Day TV unit in medium walnut","width":1800,"height":700},{"src":"/images/tv-units/day-black-oak.webp","alt":"Day TV unit in black oak","width":1800,"height":700}]$$::jsonb,
   $$[{"name":"Natural oak, medium walnut or black oak veneer"},{"name":"Push-to-open fronts"},{"name":"Cable-managed storage"}]$$::jsonb,
   $${"width":240,"depth":45,"height":40,"unit":"cm"}$$::jsonb,
   'Atelier', false, true)

on conflict (slug) do update set
  name             = excluded.name,
  category_slug    = excluded.category_slug,
  subcategory_slug = excluded.subcategory_slug,
  summary          = excluded.summary,
  description      = excluded.description,
  images           = excluded.images,
  materials        = excluded.materials,
  dimensions       = excluded.dimensions,
  collection       = excluded.collection,
  is_featured      = excluded.is_featured,
  is_new           = excluded.is_new,
  updated_at       = now();

-- Remove any products no longer in the catalogue (e.g. the previous seed set).
delete from public.products
where slug not in (
  'cloud-sofa','oslo-sofa','palermo-sofa','skyline-sofa',
  'rivera-u-sectional','cosmo-modular-sectional','marlow-sectional','cascade-sectional',
  'comfort-bed','haven-bed','lora-bed',
  'day-tv-unit'
);
