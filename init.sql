DROP DATABASE if exists eklmdb;
CREATE DATABASE if NOT EXISTS eklmdb;
USE eklmdb;

CREATE TABLE if NOT EXISTS benutzer(
	benu_id INT PRIMARY KEY AUTO_INCREMENT,
	username VARCHAR(64),
	passwort CHAR(128)
);

INSERT INTO benutzer VALUES
(1, 'admin', '8450eca01665516d9aeb5317764902b78495502637c96192c81b1683d32d691a0965cf037feca8b9ed9ee6fc6ab8f27fce8f77c4fd9b4a442a00fc317b8237e6'),
(2, 'adam',  '');

CREATE TABLE if NOT EXISTS einkaufsliste(
	EKLI_ID INT PRIMARY KEY AUTO_INCREMENT,
	zeitstempel TIMESTAMP,
	bezeichnung VARCHAR(64),
	hinweis VARCHAR(256),
	BENU_ID INT,
	FOREIGN KEY( BENU_ID ) REFERENCES benutzer(BENU_ID)
);

INSERT INTO einkaufsliste VALUES
( 1, '2000-01-01 12:12:12', 'Einkaufsliste für mich', '', 1),
( 2, '2000-01-01 13:13:13', 'Einkaufsliste für alle', '', 1),
( 3, '2000-01-01 14:14:14', 'Einkaufsliste Adam', '', 2);

CREATE TABLE if NOT EXISTS benutzer_zugriff_einkaufsliste(
	BENU_ID INT,
	EKLI_ID INT,
	PRIMARY KEY( BENU_ID, EKLI_ID ),
	FOREIGN KEY( BENU_ID ) REFERENCES benutzer( BENU_ID ),
	FOREIGN KEY( EKLI_ID ) REFERENCES einkaufsliste( EKLI_ID )
);

INSERT INTO benutzer_zugriff_einkaufsliste VALUES
( 2, 2 ),
( 1, 3 );


CREATE TABLE if NOT EXISTS produkte(
	PROD_ID INT AUTO_INCREMENT,
	bezeichnung VARCHAR(64),
	ist_zutat BOOLEAN,
	commoneinheit VARCHAR(16),
	PRIMARY KEY ( PROD_ID )
);

INSERT INTO produkte VALUES
( 1, "Shampoo", false, "Flasche" ),
( 2, "Champignons", true, "Gramm" ),
( 3, "Burger Patties", true, "Packung" ),
( 4, "Apfel", true, "x" ),
( 5, "Birnen", true, "x" ),
( 6, "Banane", true, "x" ),
( 7, "Zitrone", true, "x" ),
( 8, "Tomaten", true, "x" ),
( 9, "Zwiebeln", true, "x" ),
(10, "Knoblauch", true, "x" ),
(11, "Kartoffeln", true, "x" ),
(12, "Karotten", true, "x" ),
(13, "Schnitzel", true, "x" ),
(14, "Pommes frites", true, "Packungen" ),
(15, "Tomatensauce", true, "Gramm" ),
(16, 'Spaghetti', true, 'Packung'),
(17, 'Hackfleisch', true, 'Gramm'),
(18, 'Tomatenmark', true, 'Gramm'),
(19, 'Hähnchenfleisch', true, 'Gramm'),
(20, 'Hühnerbrühe', true, 'Liter'),
(21, 'Sahne', true, 'x'),
(22, 'Senf', true, 'x'),
(23, 'Dill', true, 'Gramm'),
(24, 'Ei', true, 'Stück'),
(25, 'Öl', true, 'Milliliter'),
(26, 'Butter', true, 'Gramm'),
(27, 'Schinken', true, 'Gramm'),
(28, 'Käse', true, 'Gramm'),
(29, 'Spinat', true, 'Gramm'),
(30, 'Milch', true, 'Liter'),
(31, 'Honig', true, 'Gramm'),
(32, 'Nüsse', true, 'Gramm'),
(33, 'Basilikum', true, 'Gramm'),
(34, 'Zucker', true, 'Gramm'),
(35, 'Essig', true, 'Milliliter'),
(36, 'Pfeffer', true, 'Packung'),
(37, 'Salz', true, 'Packung'),
(38, 'Reis', true, 'Gramm'),
(39, 'Seife', false, 'Flasche'),
(40, 'Zahnpasta', false, 'Flasche'),
(41, 'Gurke', true, 'Stück'),
(42, 'Schokoaufstrich', true, 'Packung'),
(43, 'Gummibärchen', true, 'Packung'),
(44, 'Mineralwasser', true, 'Flaschen'),
(45, 'Paprika', true, 'Stück'),
(46, 'Toilettenpapier', false, 'Packung'),
(47, 'Taschentücher', false, 'Packungen'),
(48, 'Kerzen', false, 'x'),
(49, 'Batterien AA', false, 'Stück'),
(50, 'Batterien AAA', false, 'Stück'),
(51, 'Waschmittel', false, 'Packung'),
(52, 'Vogelfutter', false, 'Packung'),
(53, 'Gefrierbeutel', false, 'Stück'),
(54, 'Müllbeutel', false, 'Stück'),
(55, 'Glasreiniger', false, 'Falsche'),
(56, 'Staubtücher', false, 'Falsche'),
(57, 'Kalkreiniger', false, 'Falsche'),
(58, 'Fleckenentferner', false, 'Packung'),
(59, 'WC-Reiniger', false, 'Falsche'),
(60, 'Deodorant', false, 'Falsche'),
(61, 'Parfüm', false, 'Falsche'),
(62, 'Hautcreme', false, 'Falsche'),
(63, 'Erbsen', true, 'Packung'),
(64, 'Rosenkohl', true, 'Packung'),
(65, 'Karotten', true, 'Stück'),
(66, 'Marzipan', true, 'Stück'),
(67, 'Wein', true, 'Flasche'),
(68, 'Vodka', true, 'Flasche'),
(69, 'Magnesium', false, 'Packung'),
(70, 'Vitamin B12', false, 'Packung'),
(71, 'Kaffee', true, 'Packung'),
(72, 'Espresso', true, 'Packung'),
(73, 'Kakao', true, 'Packung'),
(74, 'Klebeband', false, 'Packung'),
(75, 'Frischkäse', true, 'Packung'),
(76, 'Marmelade', true, 'Glas'),
(79, 'Müsli', true, 'Glas'),
(77, 'Joghurt', true, 'Becher'),
(78, 'Spülmittel', false, 'Flasche');

CREATE TABLE if NOT EXISTS einkaufsliste_enhaelt_produkte(
	EKLI_PROD_ID INT AUTO_INCREMENT,
	EKLI_ID INT,
	PROD_ID INT,
	menge   VARCHAR(64),
	einheit VARCHAR(64),
	PRIMARY KEY( EKLI_PROD_ID ),
	FOREIGN KEY( EKLI_ID ) REFERENCES einkaufsliste( EKLI_ID ),
	FOREIGN KEY( PROD_ID ) REFERENCES produkte( PROD_ID )
);

INSERT INTO einkaufsliste_enhaelt_produkte VALUES
( 1, 1, 1, '1', 'Flasche' ),
( 2, 2, 2, '2', 'Packung' ),
( 3, 2, 3, '1', 'Packung' ),
( 4, 3, 1, '7', 'Flaschen' );


CREATE TABLE if NOT EXISTS gerichte(
	GERI_ID INT AUTO_INCREMENT,
	bezeichnung VARCHAR(64),
	zubereitungsdauer VARCHAR(16),
	rezept VARCHAR(4096),
	schwierigkeitsgrad INT,
	PRIMARY KEY( GERI_ID )
);

INSERT INTO gerichte VALUES
( 1, 'Burger mit Pilzen', '10min', 'Alles braten!', 1 ),
( 2, 'Schnitzel mit Pommes frites und Tomatensauce', '30 Minuten', '1. Schnitzel nach Packungsanweisung zubereiten.\n2. Pommes frites im Ofen backen.\n3. Tomatensauce erhitzen und zu den Pommes frites servieren.', 1 ),
( 3, 'Spaghetti Bolognese', '45 Minuten', '1. Koche die Spaghetti nach Packungsanweisung.\n2. Brate in einer Pfanne Hackfleisch an und würze es mit Salz, Pfeffer und italienischen Gewürzen.\n3. Füge Tomatenmark und gehackte Tomaten hinzu und lass das Ganze etwa 20 Minuten köcheln.\n4. Vermenge die Sauce mit den gekochten Spaghetti und serviere das Gericht heiß.', 1 ),
( 4, 'Hühnerfrikassee', '45 Minuten', '1. Zerteile das Hähnchenfleisch in kleine Stücke und brate es in einer Pfanne an.\n2. Füge gehackte Zwiebeln, Karotten und Champignons hinzu und brate alles zusammen an.\n3. Gieße Hühnerbrühe über das Fleisch und die Gemüse und lass alles etwa 30 Minuten köcheln.\n4. Verfeinere das Frikassee mit Sahne, Senf und gehacktem Dill und serviere es heiß mit Reis oder Kartoffeln.', 1 ),
( 5, 'Omelette', '15 Minuten', '1. Verquirle in einer Schüssel 2 Eier und würze sie mit Salz und Pfeffer.\n2. Erhitze in einer Pfanne etwas Öl oder Butter und gieße die Eier hinein.\n3. Während das Omelette stockt, kannst du gehackte Tomaten, Schinken oder Käse darauf legen.\n4. Wenn das Omelette fest genug ist, falte es in der Mitte zusammen und serviere es heiß.', 1),
( 6, 'Grüne Smoothies', '15 Minuten', '1. Wasche und schneide 1 Handvoll Spinat, 1 Banane und 1 Apfel in Stücke.\n2. Vermenge die Zutaten in einem Mixer mit 1 Tasse Wasser oder Milch und mixe alles zu einem glatten Smoothie.\n3. Füge nach Belieben noch etwas Honig oder Nüsse hinzu und genieße den Smoothie sofort.', 1),
( 7, 'Tomatensauce', '50 Minuten', '1. Für die klassische Tomatensauce die Tomaten kreuzweise einschneiden und mit heißem Wasser übergießen. Nun die Haut abziehen und die Tomaten klein schneiden. Eventuell die Kerne entfernen.\n2. Danach Zwiebel und Knoblauch ebenfalls schälen und klein hacken. In einem Topf das Öl erhitzen und beides glasig andünsten. Den Zucker untermengen und etwas karamellisieren lassen.\n3. Nun mit Essig ablöschen, die Tomaten zugeben und rund 25-30 Minuten einkochen lassen. Nicht vergessen - öfters umrühren.\n4. In der Zwischenzeit das Basilikum waschen, abtropfen lassen und fein hacken. In die fertige gekochte Sauce einrühren und noch mit Salz und Pfeffer abschmecken.', 2);

CREATE TABLE if NOT EXISTS gerichte_enthaelt_produkte(
	GERI_PROD_ID INT AUTO_INCREMENT, 
	GERI_ID INT,
	PROD_ID INT,
	menge VARCHAR(8),
	einheit VARCHAR(16),
	PRIMARY KEY( GERI_PROD_ID ),
	FOREIGN KEY( GERI_ID ) REFERENCES gerichte( GERI_ID ),
	FOREIGN KEY( PROD_ID ) REFERENCES produkte( PROD_ID )
);

INSERT INTO gerichte_enthaelt_produkte VALUES
( 1, 1, 2, '200', 'Gramm' ),
( 2, 1, 3, '4', 'Patties' ),
( 3, 2, 13, '1', 'Stück'),
( 4, 2, 14, '100', 'Gramm'),
( 5, 2, 15, '200', 'Milliliter'),
( 6, 3, 8, '150', 'Gramm'),
( 7, 3, 16, '200', 'Gramm'),
( 8, 3, 17, '150', 'Gramm'),
( 9, 3, 18, '100', 'Gramm'),
( 10, 3, 36, '1', 'Prise'),
( 11, 3, 37, '1', 'Prise'),
( 12, 4, 19, '200', 'Gramm'),
( 13, 4, 9, '50', 'Gramm'),
( 14, 4, 12, '50', 'Gramm'),
( 15, 4, 2, '50', 'Gramm'),
( 16, 4, 20, '300', 'Milliliter'),
( 17, 4, 21, '1', 'Spritzer'),
( 18, 4, 22, '1', 'EL'),
( 19, 4, 23, '1', 'Handvoll'),
( 20, 4, 11, '100', 'Gramm'),
( 21, 4, 38, '100', 'Gramm'),
( 22, 5, 24, '2', 'Stück'),
( 23, 5, 36, '2', 'Prisen'),
( 24, 5, 37, '2', 'Prisen'),
( 25, 5, 25, '2', 'EL'),
( 26, 5, 26, '25', 'Gramm'),
( 27, 5, 8, '1', 'Stück'),
( 28, 5, 27, '1', 'Scheibe'),
( 29, 5, 28, '1', 'Scheibe'),
( 30, 6, 29, '1', 'Handvoll'),
( 31, 6, 6, '1', 'Stück'),
( 32, 6, 4, '1', 'Stück'),
( 33, 6, 30, '1', 'Tasse'),
( 34, 6, 31, '1', 'EL'),
( 35, 6, 32, '1', 'Handvoll'),
( 36, 7, 8, '2', 'kg'),
( 37, 7, 9, '3', 'Stück'),
( 38, 7, 10, '4', 'Zehen'),
( 39, 7, 25, '5', 'EL'),
( 40, 7, 24, '1', 'EL'),
( 41, 7, 35, '5', 'EL'),
( 42, 7, 33, '1', 'Bund'),
( 43, 7, 36, '1', 'Prise'),
( 44, 7, 37, '1', 'Prise');


CREATE TABLE if NOT EXISTS eigenschaft(
	EIGS_ID INT AUTO_INCREMENT,
	bezeichnung VARCHAR(64),
	vergleichsgruppe INT,
	prio INT,
	anzeigen BOOLEAN,
	PRIMARY KEY( EIGS_ID )
);

INSERT INTO eigenschaft VALUES
	(1, 'Tierisch', 0, 0, true),
	(2, 'Vegetarisch', 0, 1, true),
	(3, 'Vegan', 0, 2, true),
	(4, 'Gemüse', -1, -1, true),
	(5, 'Obst', -1, -1, true),
	(6, 'Gewürz', -1, -1, false),
	(7, 'Süß', -1, -1, false),
	(8, 'Sauer', -1, -1, false),
	(9, 'Salzig', -1, -1, false);

CREATE TABLE if NOT EXISTS produkte_besitzt_eigenschaft(
	PROD_ID INT,
	EIGS_ID INT,
	PRIMARY KEY( PROD_ID, EIGS_ID ),
	FOREIGN KEY( PROD_ID ) REFERENCES produkte( PROD_ID ),
	FOREIGN KEY( EIGS_ID ) REFERENCES eigenschaft( EIGS_ID )
);

INSERT INTO produkte_besitzt_eigenschaft VALUES
( 2, 3 ),
( 3, 1 ),
( 1, 3 ),
( 4, 5 ),
( 5, 5 ),
( 6, 5 ),
( 7, 5 ),( 7, 8 ),
( 8, 4 ),
( 9, 4 ),
( 10, 6),
( 11, 4),
( 12, 4),
( 13, 1),
( 14, 3),
( 15, 3),
( 16, 3),
( 17, 1),
( 18, 3),
( 19, 1),
( 20, 1),
( 21, 2),
( 22, 3),
( 23, 3),
( 24, 2),
( 25, 3),
( 26, 2),
( 27, 1),
( 28, 2),
( 29, 3),
( 30, 2),
( 31, 2),
( 31, 7),
( 32, 3),
( 33, 3),
( 34, 3),
( 34, 7),
( 35, 3),
( 36, 6),
( 37, 6),
( 37, 9),
( 38, 3),
( 41, 3),
( 41, 4),
( 42, 7),
( 42, 2),
( 43, 1),
( 43, 7),
( 45, 3),
( 45, 4),
( 63, 3),
( 63, 4),
( 64, 3),
( 64, 4),
( 65, 3),
( 65, 4),
( 66, 3),
( 66, 7),
( 75, 2),
( 76, 3),
( 76, 7),
( 77, 2),
( 77, 7),
( 79, 3);
