-- Sample data for SlashFood
-- Run this after running schema.sql

-- Insert sample partners
INSERT INTO partners (name, email, phone, address, latitude, longitude, business_type, description) VALUES
('Kilimanjaro Restaurant', 'contact@kilimanjaro.ng', '+234-801-234-5678', '12 Akin Adesola Street, Victoria Island, Lagos', 6.4265, 3.4234, 'restaurant', 'Authentic Nigerian and continental cuisine'),
('Sweet Sensations Bakery', 'info@sweetsensations.ng', '+234-802-345-6789', '15 Admiralty Way, Lekki Phase 1, Lagos', 6.4474, 3.4737, 'bakery', 'Fresh pastries, cakes and baked goods daily'),
('Grill Masters VI', 'orders@grillmastersvi.ng', '+234-803-456-7890', '5 Ozumba Mbadiwe Avenue, Victoria Island, Lagos', 6.4281, 3.4219, 'restaurant', 'Premium grilled meats and BBQ specialists'),
('Mama Put Express', 'hello@mamaputexpress.ng', '+234-804-567-8901', '23 Mobolaji Bank Anthony Way, Ikeja GRA, Lagos', 6.5958, 3.3621, 'restaurant', 'Traditional Nigerian comfort food'),
('Fresh Mart Supermarket', 'support@freshmart.ng', '+234-805-678-9012', '45 Allen Avenue, Ikeja, Lagos', 6.6018, 3.3515, 'supermarket', 'Fresh groceries and household essentials'),
('Coconut Groove', 'info@coconutgroove.ng', '+234-806-789-0123', '78 Admiralty Way, Lekki Phase 1, Lagos', 6.4498, 3.4742, 'restaurant', 'Healthy smoothies, salads and organic meals');

-- Insert sample deals for today
INSERT INTO deals (partner_id, title, description, category, original_price, discounted_price, available_quantity, pickup_start_time, pickup_end_time) VALUES
-- Kilimanjaro Restaurant deals
((SELECT id FROM partners WHERE name = 'Kilimanjaro Restaurant'), 'Surprise Dinner Bag', 'A delightful mix of our chef''s choice dishes including rice, protein, and sides. Perfect for 1-2 people.', 'restaurant', 2500.00, 750.00, 5, '19:00', '21:00'),
((SELECT id FROM partners WHERE name = 'Kilimanjaro Restaurant'), 'Lunch Special Box', 'Hearty lunch portion with jollof rice, grilled chicken, and plantain', 'restaurant', 1800.00, 540.00, 8, '12:00', '15:00'),

-- Sweet Sensations Bakery deals
((SELECT id FROM partners WHERE name = 'Sweet Sensations Bakery'), 'Fresh Bakery Box', 'Assorted fresh pastries, bread, cakes, and baked goods from today''s batch. Great variety!', 'bakery', 3000.00, 900.00, 12, '20:00', '22:00'),
((SELECT id FROM partners WHERE name = 'Sweet Sensations Bakery'), 'Morning Pastry Pack', 'Fresh croissants, muffins, and danish pastries perfect for breakfast', 'bakery', 2000.00, 600.00, 6, '08:00', '11:00'),

-- Grill Masters VI deals
((SELECT id FROM partners WHERE name = 'Grill Masters VI'), 'Mixed Grill Platter', 'Assorted grilled meats, chicken, beef, and sides with our signature sauce. Feeds 2-3 people.', 'restaurant', 4500.00, 1350.00, 3, '21:00', '23:00'),
((SELECT id FROM partners WHERE name = 'Grill Masters VI'), 'BBQ Lunch Deal', 'Grilled chicken quarters with sides and BBQ sauce', 'restaurant', 2800.00, 980.00, 7, '12:30', '16:00'),

-- Mama Put Express deals
((SELECT id FROM partners WHERE name = 'Mama Put Express'), 'Jollof Party Pack', 'Large portion of authentic jollof rice with chicken and peppered beef. Perfect for sharing!', 'restaurant', 1800.00, 600.00, 15, '18:00', '20:00'),
((SELECT id FROM partners WHERE name = 'Mama Put Express'), 'Traditional Combo', 'Rice, beans, plantain with assorted meat. Authentic Nigerian comfort food.', 'restaurant', 1500.00, 525.00, 10, '13:00', '16:30'),

-- Fresh Mart Supermarket deals
((SELECT id FROM partners WHERE name = 'Fresh Mart Supermarket'), 'Grocery Surprise Box', 'Mix of fresh produce, pantry items, and household essentials. Great value pack!', 'supermarket', 3500.00, 1050.00, 20, '19:30', '21:30'),
((SELECT id FROM partners WHERE name = 'Fresh Mart Supermarket'), 'Fresh Produce Pack', 'Assorted fresh fruits and vegetables, perfect for healthy meal prep', 'supermarket', 2500.00, 875.00, 15, '17:00', '19:00'),

-- Coconut Groove deals
((SELECT id FROM partners WHERE name = 'Coconut Groove'), 'Healthy Meal Box', 'Nutritious salad, smoothie, and organic snacks. Perfect for health-conscious foodies.', 'restaurant', 2200.00, 770.00, 8, '17:30', '20:00'),
((SELECT id FROM partners WHERE name = 'Coconut Groove'), 'Smoothie & Snack Pack', 'Fresh fruit smoothies and organic energy bars. Great for on-the-go.', 'restaurant', 1600.00, 560.00, 12, '14:00', '18:00');

-- Insert some sample customers (optional - customers will be created when they place orders)
INSERT INTO customers (name, email, phone) VALUES
('John Doe', 'john.doe@example.com', '+234-701-234-5678'),
('Sarah Johnson', 'sarah.j@example.com', '+234-702-345-6789'),
('Michael Chen', 'mike.chen@example.com', '+234-703-456-7890');