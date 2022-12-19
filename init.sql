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
(15, "Tomatensauce", true, "Gramm" );


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
( 3, 'Spaghetti Bolognese', '45 Minuten', '1. Koche die Spaghetti nach Packungsanweisung.\n2. Brate in einer Pfanne Hackfleisch an und würze es mit Salz, Pfeffer und italienischen Gewürzen.\n3. Brate in einer Pfanne Hackfleisch an und würze es mit Salz, Pfeffer und italienischen Gewürzen.\n4. Vermenge die Sauce mit den gekochten Spaghetti und serviere das Gericht heiß.', 1 ),
( 4, 'Hühnerfrikassee', '45 Minuten', '1. Zerteile das Hähnchenfleisch in kleine Stücke und brate es in einer Pfanne an.\n2. Füge gehackte Zwiebeln, Karotten und Champignons hinzu und brate alles zusammen an.\n3. Gieße Hühnerbrühe über das Fleisch und die Gemüse und lass alles etwa 30 Minuten köcheln.\n4. Verfeinere das Frikassee mit Sahne, Senf und gehacktem Dill und serviere es heiß mit Reis oder Kartoffeln.', 1 ),
( 5, 'Omelette', '15 Minuten', '1. Verquirle in einer Schüssel 2 Eier und würze sie mit Salz und Pfeffer.\n2. Erhitze in einer Pfanne etwas Öl oder Butter und gieße die Eier hinein.\n3. Während das Omelette stockt, kannst du gehackte Tomaten, Schinken oder Käse darauf legen.\n4. Wenn das Omelette fest genug ist, falte es in der Mitte zusammen und serviere es heiß.', 1),
( 6, 'Grüne Smoothies', '15 Minuten', '1. Wasche und schneide 1 Handvoll Spinat, 1 Banane und 1 Apfel in Stücke.\n2. Vermenge die Zutaten in einem Mixer mit 1 Tasse Wasser oder Milch und mixe alles zu einem glatten Smoothie.\n3. Füge nach Belieben noch etwas Honig oder Nüsse hinzu und genieße den Smoothie sofort.', 1);


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
( 2, 1, 3, '4', 'Patties' );


CREATE TABLE if NOT EXISTS eigenschaft(
	EIGS_ID INT AUTO_INCREMENT,
	bezeichnung VARCHAR(64),
	vergleichsgruppe INT,
	prio INT,
	anzeigen BOOLEAN,
	PRIMARY KEY( EIGS_ID )
);

INSERT INTO eigenschaft VALUES
	(1, 'Tierisch', 0, 0, 1),
	(2, 'Vegetarisch', 0, 1, 1),
	(3, 'Vegan', 0, 2, 1),
	(4, 'Gemüse', -1, -1, 1),
	(5, 'Obst', -1, -1, 1),
	(6, 'Gewürz', -1, -1, 0),
	(7, 'Süß', -1, -1, 0),
	(8, 'Sauer', -1, -1, 0),
	(9, 'Salzig', -1, -1, 0);

CREATE TABLE if NOT EXISTS produkte_besitzt_eigenschaft(
	PROD_ID INT,
	EIGS_ID INT,
	PRIMARY KEY( PROD_ID, EIGS_ID ),
	FOREIGN KEY( PROD_ID ) REFERENCES produkte( PROD_ID ),
	FOREIGN KEY( EIGS_ID ) REFERENCES eigenschaft( EIGS_ID )
);

INSERT INTO produkte_besitzt_eigenschaft VALUES
( 2, 3 ),
( 3, 1 );
