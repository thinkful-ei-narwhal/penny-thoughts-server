BEGIN;

TRUNCATE
  messages,
  users RESTART IDENTITY CASCADE;

INSERT INTO users (full_name, username, email, reported_count, daily_count, banned, admin, password)
VALUES

('$2y$12$DcXPqp1cR.ZAyKhh0W.tre.9gqCh0.Vhl09EraDCHKoOTeoLBy3/K', '$2y$12$m4CC0X/5tZ9dQXICSo5Duumnp/6PamoUMXW.bxMbvcXvd.7hOcPTq', '$2y$12$dTMw7na7OkgCN1y1FYTgbO3UU9toHZBmMu3uUdP0xUdrZYSVYcCJW', 0, 0, FALSE, TRUE, '$2y$12$tYIjrKsOGna4rbojZv3Fd.f9as95QG7fLmJ1KCDxuAFiZHkq0YqbS'),
('$2y$12$GrKd04/KDnjtxMpzSvHEbucEFQnDtySHavMhFOJVxn4YfedjgELsa', '$2y$12$029iSROwq4mlzAr52qngwOluuiUyy5TGHBI6bum3r5fPVUCt2Tfse', '$2y$12$XnWnEwkNffoNnabhBtPXm.fzNqmi1h7tgDOZMfebTlbBtz58gKtaG', 0, 0, FALSE, FALSE, '$2y$12$o8x/EkucH4Xiw0TwQgqxJ.dvgMDYBZ/VDAGZ/4hrW58qJAkir77t.');

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