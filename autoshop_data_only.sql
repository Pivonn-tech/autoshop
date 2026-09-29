--
-- PostgreSQL database dump
--

\restrict hseFF4R6z5rarGonmrNdzOsQIBo0usfLYodpN6yZ25UOQ06l9nd2hHskz9SVbvP

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: autoshop
--

COPY public."User" (id, name, email, "emailVerified", password, image, "createdAt", "updatedAt", "isAdmin") FROM stdin;
\.


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: autoshop
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: Appointment; Type: TABLE DATA; Schema: public; Owner: autoshop
--

COPY public."Appointment" (id, "userId", "customerName", phone, email, vehicle, "licensePlate", "serviceId", "preferredDate", "preferredTime", notes, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CarListing; Type: TABLE DATA; Schema: public; Owner: autoshop
--

COPY public."CarListing" (id, "userId", make, model, year, mileage, color, "bodyType", "fuelType", transmission, "engineSize", condition, price, currency, negotiable, status, title, description, features, images, "primaryImage", location, "contactPhone", "contactEmail", "viewCount", featured, "approvedAt", "rejectedAt", "rejectionReason", "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Cart; Type: TABLE DATA; Schema: public; Owner: autoshop
--

COPY public."Cart" (id, "userId", "sessionKey", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: autoshop
--

COPY public."CartItem" (id, "cartId", "productId", name, price, image, quantity, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: autoshop
--

COPY public."Order" (id, "userId", items, total, status, "shippingAddress", "paymentMethod", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SavedVehicle; Type: TABLE DATA; Schema: public; Owner: autoshop
--

COPY public."SavedVehicle" (id, "userId", "productId", "savedAt") FROM stdin;
\.


--
-- Data for Name: ServiceBooking; Type: TABLE DATA; Schema: public; Owner: autoshop
--

COPY public."ServiceBooking" (id, "userId", "serviceId", date, "time", status, "totalPrice", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: autoshop
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: autoshop
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: autoshop
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
8bddf569-9ddf-47e3-99e3-32dc41554bc0	dbfd014c2fa3cfd315b5359b82323939e54a60e1278410cd6df973b08b157e7c	2026-09-29 12:13:28.814641+00	20260524113603_init	\N	\N	2026-09-29 12:13:28.254913+00	1
4af77327-3d6f-49a8-a992-a754b0d57d63	2c1aaa85c11d3cbc9b03eec7eaf0a1c9247d167ee10a897283b3fcf1e727f140	2026-09-29 12:13:29.394246+00	20260916121958_add_cart_appointment_isadmin	\N	\N	2026-09-29 12:13:28.82098+00	1
\.


--
-- PostgreSQL database dump complete
--

\unrestrict hseFF4R6z5rarGonmrNdzOsQIBo0usfLYodpN6yZ25UOQ06l9nd2hHskz9SVbvP

