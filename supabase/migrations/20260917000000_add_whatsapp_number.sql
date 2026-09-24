ALTER TABLE restaurants
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;

COMMENT ON COLUMN restaurants.whatsapp_number
  IS 'Vendor WhatsApp number in international format, e.g. 2348012345678';

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN (
  'pending', 
  'paid', 
  'confirmed', 
  'accepted', 
  'preparing', 
  'ready', 
  'assigned', 
  'picked_up', 
  'delivered', 
  'cancelled'
));
