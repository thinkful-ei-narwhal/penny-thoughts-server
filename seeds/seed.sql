BEGIN;

TRUNCATE
  messages,
  users RESTART IDENTITY CASCADE;

INSERT INTO users (full_name, username, email, reported_count, daily_count, banned, admin, password)
VALUES

('{\"iv\":\"6f3dec41b8d23ea1c17a765f542c4216\",\"encryptedData\":\"4ba31def16e6c2e3c7b6b5f1b8223688\"}', 'admin1', '{\"iv\":\"6f3dec41b8d23ea1c17a765f542c4216\",\"encryptedData\":\"a0d47fee849f0a7fde27c276458fd4e5\"}', 0, 0, FALSE, TRUE, '$2a$12$Bb32xLAKgB5IBLEpSK1.4OIhzegi53MuUo24j7twUsxttcBVPWuge'),
('{\"iv\":\"6f3dec41b8d23ea1c17a765f542c4216\",\"encryptedData\":\"4ba31def16e6c2e3c7b6b5f1b8223688\"}', 'admin2', '{\"iv\":\"6f3dec41b8d23ea1c17a765f542c4216\",\"encryptedData\":\"20ef1ac3a5032294d1f9cb9d739da68af9dd8a3f110eeb11cd2b033e8e32cd7a\"}', 0, 0, FALSE, FALSE, '$2a$12$EA/pj9jZ2bzhZjJbTUW7yuxGDElDsFpnZmhBdPoetNXsVlPkletT.');

INSERT INTO messages (message, archived, flagged, user_id)
VALUES

('I hope you have a great day!', FALSE, FALSE, 1),
('Smile!', FALSE, FALSE, 2),
('You can do it!', FALSE, FALSE, 1),
('You are loved!', FALSE, FALSE, 2),
('Dream It, Wish it, Do it!', FALSE, FALSE, 1),
('Dream Bigger, Do Bigger!', FALSE, FALSE, 2),
('You are worth it!', FALSE, FALSE, 1),
('Good morning from Malta!', FALSE, FALSE, 2),
('It is going to be a wonderful day!', FALSE, FALSE, 1),
('Shoot for the stars!', FALSE, FALSE, 2),
('We are all in this together!', FALSE, FALSE, 1),
('Stay positive!', FALSE, FALSE, 2),
('Be happy!', FALSE, FALSE, 1),
('Everything is great!', FALSE, FALSE, 2),
('Hitler did 9/11', FALSE, TRUE, 2);

COMMIT;