--
-- PostgreSQL database dump
--

\restrict rNP0eiaYq9D6anb0UHBkg66pmkqvjydBhs4yy9ljZ31DpqwhJvbn7IpbZ8uKYp5

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: autoshop
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public."Account" OWNER TO autoshop;

--
-- Name: Appointment; Type: TABLE; Schema: public; Owner: autoshop
--

CREATE TABLE public."Appointment" (
    id text NOT NULL,
    "userId" text,
    "customerName" text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    vehicle text NOT NULL,
    "licensePlate" text NOT NULL,
    "serviceId" text NOT NULL,
    "preferredDate" timestamp(3) without time zone NOT NULL,
    "preferredTime" text NOT NULL,
    notes text,
    status text DEFAULT 'Pending'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Appointment" OWNER TO autoshop;

--
-- Name: CarListing; Type: TABLE; Schema: public; Owner: autoshop
--

CREATE TABLE public."CarListing" (
    id text NOT NULL,
    "userId" text NOT NULL,
    make text NOT NULL,
    model text NOT NULL,
    year integer NOT NULL,
    mileage integer NOT NULL,
    color text NOT NULL,
    "bodyType" text NOT NULL,
    "fuelType" text NOT NULL,
    transmission text NOT NULL,
    "engineSize" text,
    condition text NOT NULL,
    price double precision NOT NULL,
    currency text DEFAULT 'KSH'::text NOT NULL,
    negotiable boolean DEFAULT true NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    features jsonb NOT NULL,
    images jsonb NOT NULL,
    "primaryImage" text,
    location jsonb NOT NULL,
    "contactPhone" text NOT NULL,
    "contactEmail" text,
    "viewCount" integer DEFAULT 0 NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    "approvedAt" timestamp(3) without time zone,
    "rejectedAt" timestamp(3) without time zone,
    "rejectionReason" text,
    "expiresAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CarListing" OWNER TO autoshop;

--
-- Name: Cart; Type: TABLE; Schema: public; Owner: autoshop
--

CREATE TABLE public."Cart" (
    id text NOT NULL,
    "userId" text,
    "sessionKey" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Cart" OWNER TO autoshop;

--
-- Name: CartItem; Type: TABLE; Schema: public; Owner: autoshop
--

CREATE TABLE public."CartItem" (
    id text NOT NULL,
    "cartId" text NOT NULL,
    "productId" text NOT NULL,
    name text NOT NULL,
    price double precision NOT NULL,
    image text,
    quantity integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CartItem" OWNER TO autoshop;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: autoshop
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "userId" text NOT NULL,
    items jsonb NOT NULL,
    total double precision NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "shippingAddress" jsonb NOT NULL,
    "paymentMethod" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Order" OWNER TO autoshop;

--
-- Name: SavedVehicle; Type: TABLE; Schema: public; Owner: autoshop
--

CREATE TABLE public."SavedVehicle" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "productId" text NOT NULL,
    "savedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SavedVehicle" OWNER TO autoshop;

--
-- Name: ServiceBooking; Type: TABLE; Schema: public; Owner: autoshop
--

CREATE TABLE public."ServiceBooking" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "serviceId" text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "time" text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "totalPrice" double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ServiceBooking" OWNER TO autoshop;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: autoshop
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO autoshop;

--
-- Name: User; Type: TABLE; Schema: public; Owner: autoshop
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text,
    "emailVerified" timestamp(3) without time zone,
    password text,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isAdmin" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."User" OWNER TO autoshop;

--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: autoshop
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO autoshop;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: autoshop
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO autoshop;

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
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: autoshop
--

COPY public."User" (id, name, email, "emailVerified", password, image, "createdAt", "updatedAt", "isAdmin") FROM stdin;
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
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: autoshop
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Appointment Appointment_pkey; Type: CONSTRAINT; Schema: public; Owner: autoshop
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "Appointment_pkey" PRIMARY KEY (id);


--
-- Name: CarListing CarListing_pkey; Type: CONSTRAINT; Schema: public; Owner: autoshop
--

ALTER TABLE ONLY public."CarListing"
    ADD CONSTRAINT "CarListing_pkey" PRIMARY KEY (id);


--
-- Name: CartItem CartItem_pkey; Type: CONSTRAINT; Schema: public; Owner: autoshop
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY (id);


--
-- Name: Cart Cart_pkey; Type: CONSTRAINT; Schema: public; Owner: autoshop
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: autoshop
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: SavedVehicle SavedVehicle_pkey; Type: CONSTRAINT; Schema: public; Owner: autoshop
--

ALTER TABLE ONLY public."SavedVehicle"
    ADD CONSTRAINT "SavedVehicle_pkey" PRIMARY KEY (id);


--
-- Name: ServiceBooking ServiceBooking_pkey; Type: CONSTRAINT; Schema: public; Owner: autoshop
--

ALTER TABLE ONLY public."ServiceBooking"
    ADD CONSTRAINT "ServiceBooking_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: autoshop
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: autoshop
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: autoshop
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: autoshop
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: Appointment_preferredDate_idx; Type: INDEX; Schema: public; Owner: autoshop
--

CREATE INDEX "Appointment_preferredDate_idx" ON public."Appointment" USING btree ("preferredDate");


--
-- Name: Appointment_status_idx; Type: INDEX; Schema: public; Owner: autoshop
--

CREATE INDEX "Appointment_status_idx" ON public."Appointment" USING btree (status);


--
-- Name: Appointment_userId_idx; Type: INDEX; Schema: public; Owner: autoshop
--

CREATE INDEX "Appointment_userId_idx" ON public."Appointment" USING btree ("userId");


--
-- Name: CarListing_location_idx; Type: INDEX; Schema: public; Owner: autoshop
--

CREATE INDEX "CarListing_location_idx" ON public."CarListing" USING btree (location);


--
-- Name: CarListing_make_model_idx; Type: INDEX; Schema: public; Owner: autoshop
--

CREATE INDEX "CarListing_make_model_idx" ON public."CarListing" USING btree (make, model);


--
-- Name: CarListing_price_idx; Type: INDEX; Schema: public; Owner: autoshop
--

CREATE INDEX "CarListing_price_idx" ON public."CarListing" USING btree (price);


--
-- Name: CarListing_status_createdAt_idx; Type: INDEX; Schema: public; Owner: autoshop
--

CREATE INDEX "CarListing_status_createdAt_idx" ON public."CarListing" USING btree (status, "createdAt");


--
-- Name: CartItem_cartId_idx; Type: INDEX; Schema: public; Owner: autoshop
--

CREATE INDEX "CartItem_cartId_idx" ON public."CartItem" USING btree ("cartId");


--
-- Name: CartItem_cartId_productId_key; Type: INDEX; Schema: public; Owner: autoshop
--

CREATE UNIQUE INDEX "CartItem_cartId_productId_key" ON public."CartItem" USING btree ("cartId", "productId");


--
-- Name: Cart_sessionKey_idx; Type: INDEX; Schema: public; Owner: autoshop
--

CREATE INDEX "Cart_sessionKey_idx" ON public."Cart" USING btree ("sessionKey");


--
-- Name: Cart_sessionKey_key; Type: INDEX; Schema: public; Owner: autoshop
--

CREATE UNIQUE INDEX "Cart_sessionKey_key" ON public."Cart" USING btree ("sessionKey");


--
-- Name: Cart_userId_idx; Type: INDEX; Schema: public; Owner: autoshop
--

CREATE INDEX "Cart_userId_idx" ON public."Cart" USING btree ("userId");


--
-- Name: SavedVehicle_userId_productId_key; Type: INDEX; Schema: public; Owner: autoshop
--

CREATE UNIQUE INDEX "SavedVehicle_userId_productId_key" ON public."SavedVehicle" USING btree ("userId", "productId");


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: autoshop
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: autoshop
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: autoshop
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: autoshop
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: autoshop
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Appointment Appointment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: autoshop
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CarListing CarListing_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: autoshop
--

ALTER TABLE ONLY public."CarListing"
    ADD CONSTRAINT "CarListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartItem CartItem_cartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: autoshop
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public."Cart"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Cart Cart_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: autoshop
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: autoshop
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SavedVehicle SavedVehicle_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: autoshop
--

ALTER TABLE ONLY public."SavedVehicle"
    ADD CONSTRAINT "SavedVehicle_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ServiceBooking ServiceBooking_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: autoshop
--

ALTER TABLE ONLY public."ServiceBooking"
    ADD CONSTRAINT "ServiceBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: autoshop
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict rNP0eiaYq9D6anb0UHBkg66pmkqvjydBhs4yy9ljZ31DpqwhJvbn7IpbZ8uKYp5

